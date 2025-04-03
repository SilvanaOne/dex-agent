import { describe, it } from "node:test";
import assert from "node:assert";
import {
  fetchDex,
  fetchBlock,
  readFromDA,
  fetchBlockProofs,
} from "@dex-agent/lib";
import { sleep } from "@silvana-one/storage";
import { DexObjects } from "./helpers/dex.js";
import { readFile } from "node:fs/promises";
import { fetchMinaAccount, initBlockchain } from "@silvana-one/mina-utils";
import { PrivateKey, PublicKey, Cache } from "o1js";
import {
  DEXContract,
  SequenceState,
  settleMinaContract,
  checkMinaContractDeployment,
  checkDataAvailability,
} from "@dex-agent/contracts";

let dexObjects: DexObjects | undefined = undefined;
const minaAdminSecretKey: string = process.env.TEST_ACCOUNT_1_PRIVATE_KEY!;
let adminSecretKey: string | undefined = process.env.ADMIN_SECRET_KEY;

const chain = process.env.MINA_CHAIN! as "devnet" | "zeko" | "mainnet";
if (chain !== "devnet" && chain !== "zeko" && chain !== "mainnet") {
  throw new Error(`Invalid chain: ${chain}`);
}

let currentMinaBlockNumber: number = 0;

describe("Settle", async () => {
  it("should read configuration", async () => {
    const config = await readFile("./data/dex-objects.json", "utf-8");
    const { dexObjects: dexObjectsInternal } = JSON.parse(
      config,
      (key, value) => {
        if (
          typeof key === "string" &&
          (key.toLowerCase().endsWith("amount") ||
            key.toLowerCase().endsWith("price")) &&
          typeof value === "string" &&
          value.endsWith("n")
        ) {
          return BigInt(value.slice(0, -1));
        }
        return value;
      }
    ) as { dexObjects: DexObjects };
    dexObjects = dexObjectsInternal;
    if (!dexObjects) {
      throw new Error("DEX_OBJECTS is not set");
    }

    //console.log("DEX_OBJECTS", dexObjects.alice);
  });
  it("should settle", async () => {
    const cache = Cache.FileSystem("./cache");
    if (!dexObjects) {
      throw new Error("DEX_OBJECTS is not set");
    }
    if (!adminSecretKey) {
      throw new Error("ADMIN_SECRET_KEY is not set");
    }
    const { pool } = dexObjects;
    if (!pool || !pool.minaPublicKey) {
      throw new Error("Pool public key is not set");
    }
    await initBlockchain(chain);
    const poolPublicKey = pool.minaPublicKey;
    console.log("poolPublicKey", poolPublicKey);
    const dexContract = new DEXContract(PublicKey.fromBase58(poolPublicKey));

    let isDeployed = await checkMinaContractDeployment({
      contractAddress: poolPublicKey,
      adminPublicKey: PrivateKey.fromBase58(minaAdminSecretKey)
        .toPublicKey()
        .toBase58(),
    });
    while (!isDeployed) {
      console.log("DEX contract is not deployed, retrying...");
      let daTx = await checkDataAvailability({
        adminKey: adminSecretKey,
        verbose: true,
        cache,
      });
      while (daTx) {
        console.log("da tx:", {
          digest: daTx.digest,
          executeTime: daTx.executeTime,
        });
        await sleep(3000);
        daTx = await checkDataAvailability({
          adminKey: adminSecretKey,
          verbose: true,
          cache,
        });
      }
      await sleep(30000);
      isDeployed = await checkMinaContractDeployment({
        contractAddress: poolPublicKey,
        adminPublicKey: PrivateKey.fromBase58(minaAdminSecretKey)
          .toPublicKey()
          .toBase58(),
      });
    }

    await fetchMinaAccount({ publicKey: poolPublicKey, force: true });
    const contractBlockNumber = Number(
      dexContract.blockNumber.get().toBigInt()
    );
    //console.log("contractBlockNumber", contractBlockNumber);
    currentMinaBlockNumber = contractBlockNumber + 1;
    // console.log(
    //   "\x1b[32m%s\x1b[0m",
    //   "currentMinaBlockNumber",
    //   currentMinaBlockNumber
    // );

    while (true) {
      let daTx = await checkDataAvailability({
        adminKey: adminSecretKey,
        verbose: true,
        cache,
      });
      while (daTx) {
        console.log("da tx:", {
          digest: daTx.digest,
          executeTime: daTx.executeTime,
        });
        await sleep(3000);
        daTx = await checkDataAvailability({
          adminKey: adminSecretKey,
          verbose: true,
          cache,
        });
      }

      await fetchMinaAccount({ publicKey: poolPublicKey, force: true });
      const contractBlockNumber = Number(
        dexContract.blockNumber.get().toBigInt()
      );
      console.log("contractBlockNumber", contractBlockNumber);
      if (contractBlockNumber >= currentMinaBlockNumber) {
        currentMinaBlockNumber = contractBlockNumber + 1;
        console.log(
          "\x1b[32m%s\x1b[0m",
          "updating currentMinaBlockNumber to ",
          currentMinaBlockNumber
        );
      }
      const dex = await fetchDex();
      if (!dex) {
        throw new Error("DEX is not received");
      }
      console.log("current_block_number", dex.block_number);
      console.log("last proved block", dex.last_proved_block_number);

      if (currentMinaBlockNumber <= dex.last_proved_block_number) {
        const block = await fetchBlock({ blockNumber: currentMinaBlockNumber });
        console.log("block.block.mina_tx_hash", block.block.mina_tx_hash);
        console.log(
          "mina_tx_included_in_block",
          block.block.mina_tx_included_in_block
        );

        if (
          block.block.mina_tx_hash !== null ||
          block.block.mina_tx_included_in_block
        ) {
          console.log(
            "The block already settled, updating currentMinaBlockNumber to ",
            currentMinaBlockNumber + 1
          );
          currentMinaBlockNumber++;
        } else {
          console.log("Fetching proofs for block", currentMinaBlockNumber);
          const proofs = await fetchBlockProofs({
            blockNumber: currentMinaBlockNumber,
          });
          if (proofs.isFinished && proofs.blockProof) {
            console.log("Settling block", currentMinaBlockNumber);
            const blockProof = proofs.blockProof;
            const proofData = await readFromDA({
              blobId: blockProof,
            });
            if (!proofData) {
              throw new Error("Proof data is not received");
            }
            const state = await SequenceState.fromJSON(proofData);
            if (!state.dexProof) {
              throw new Error("DEX proof is not received");
            }
            await settleMinaContract({
              poolPublicKey,
              adminPrivateKey: minaAdminSecretKey,
              proof: state.dexProof,
              blobId: blockProof,
              chain,
              cache,
            });
            currentMinaBlockNumber++;
          } else {
            console.log("Proofs are not ready, retrying...");
          }
        }
      }

      await sleep(15000);
    }
  });
});
