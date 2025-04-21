import {
  PrivateKey,
  Field,
  VerificationKey,
  Mina,
  PublicKey,
  Cache,
  verify,
} from "o1js";
import { DEXContract } from "./contracts/contract.js";
import { compileDEXProgram } from "./compile.js";
import { DEXProof, SequenceState } from "./contracts/rollup.js";
import {
  fetchMinaAccount,
  initBlockchain,
  accountBalanceMina,
  Memory,
  sendTx,
} from "@silvana-one/mina-utils";
import {
  getProverSecretKey,
  submitBlockProofDataAvailability,
  submitMinaTxInclusion,
} from "./proof.js";
import { submitMinaTx } from "./proof.js";
import {
  fetchDex,
  fetchBlock,
  readFromDA,
  fetchBlockProofs,
  getConfig,
  getNonce,
  waitTx,
  blockCreationNeeded,
  checkBlockCreation,
  getDAMetadata,
  saveToDA,
} from "@dex-agent/lib";
import { sleep } from "@silvana-one/storage";
import { TransactionMetadata } from "@silvana-one/prover";
import { checkMinaContractDeployment } from "./deploy.js";
import { checkDataAvailability } from "./da.js";

const minaAdminSecretKey: string = process.env.MINA_ADMIN_PRIVATE_KEY!;
let adminSecretKey: string | undefined = process.env.ADMIN_SECRET_KEY;
let currentMinaBlockNumber: number = 0;

const expectedTxStatus = "pending";
let vkContract: VerificationKey | undefined = undefined;
let vkProgram: VerificationKey | undefined = undefined;
let nonce: number = 0;

interface SettlementTransaction {
  blockNumber: number;
  number_of_transactions: number;
  sequences: number[];
  settlement_hash: string;
  nonce: number;
  proof_data_availability: string;
  proof_data_availability_digest: string;
  au_proof_data_availability?: string;
  coordination_hash?: string;
}

let settlements: SettlementTransaction[] = [];
let settling = false;

interface DataAvailabilityTransaction {
  block_number: number;
  data_availability: string;
  data_availability_digest: string;
}

let data_availability: DataAvailabilityTransaction[] = [];

export interface SettleResult {
  metadata: TransactionMetadata;
  nonce: number;
  restart: boolean;
}

export async function settle(params: {
  jobId: string;
  endTime: number;
  nonce: number;
  chain: "devnet" | "zeko" | "mainnet";
  cache: Cache;
}): Promise<SettleResult> {
  const { jobId, endTime, cache, chain } = params;
  settlements = [];
  data_availability = [];
  nonce = params.nonce;
  if (!adminSecretKey) {
    throw new Error("ADMIN_SECRET_KEY is not set");
  }
  if (!minaAdminSecretKey) {
    throw new Error("MINA_ADMIN_PRIVATE_KEY is not set");
  }
  if (nonce === undefined) {
    throw new Error("nonce is not set");
  }

  async function prepareResult(restart: boolean): Promise<SettleResult> {
    const { chain, network } = await getDAMetadata();
    return {
      metadata: {
        custom: {
          task: "settle",
        },
        jobMetadata: {
          settlement_txs: settlements.map((settlement) => ({
            chain: "mina",
            network: process.env.MINA_CHAIN as "devnet" | "mainnet",
            hash: settlement.settlement_hash,
            custom: settlement,
            linkId: settlement.blockNumber.toString(),
          })),
          data_availability_txs: data_availability.map((da) => ({
            chain,
            network,
            hash: da.data_availability,
            custom: da,
            linkId: da.block_number.toString(),
          })),
          proof_availability_txs: settlements.map((settlement) => ({
            chain,
            network,
            hash: settlement.proof_data_availability,
            custom: settlement,
            linkId: settlement.blockNumber.toString(),
          })),
          proofs: [
            ...settlements.map((settlement) => ({
              storage: {
                chain,
                network,
                hash: settlement.proof_data_availability,
                custom: settlement,
                linkId: settlement.blockNumber.toString(),
              },
              custom: settlement,
              linkId: settlement.blockNumber.toString(),
            })),
            ...settlements
              .filter((settlement) => settlement.au_proof_data_availability)
              .map((settlement) => ({
                storage: {
                  chain,
                  network,
                  hash: settlement.au_proof_data_availability as string,
                  custom: settlement,
                  linkId: settlement.blockNumber.toString(),
                },
                custom: { type: "AccountUpdates proofs", ...settlement },
                linkId: settlement.blockNumber.toString(),
              })),
          ],
          coordination_txs: [
            ...data_availability.map((da) => ({
              chain: "sui" as "sui",
              network: process.env.SUI_CHAIN as
                | "devnet"
                | "mainnet"
                | "testnet",
              hash: da.data_availability_digest,
              custom: da,
              linkId: da.block_number.toString(),
            })),
            ...settlements.map((settlement) => ({
              chain: "sui" as "sui",
              network: process.env.SUI_CHAIN as
                | "devnet"
                | "mainnet"
                | "testnet",
              hash: settlement.proof_data_availability_digest,
              custom: settlement,
              linkId: settlement.blockNumber.toString(),
            })),
            ...settlements
              .filter(
                (settlement) => settlement.coordination_hash !== undefined
              )
              .map((settlement) => ({
                chain: "sui" as "sui",
                network: process.env.SUI_CHAIN as
                  | "devnet"
                  | "mainnet"
                  | "testnet",
                hash: settlement.coordination_hash as string,
                custom: settlement,
                linkId: settlement.blockNumber.toString(),
              })),
          ],
        },
      },
      nonce,
      restart,
    };
  }

  let nextJob: boolean = true;
  while (Date.now() < endTime) {
    nextJob = await settleIteration({ jobId, endTime, cache, chain });
    if (!nextJob || Date.now() > endTime) {
      return await prepareResult(nextJob);
    }
  }
  return await prepareResult(true);
}

async function settleIteration(params: {
  jobId: string;
  endTime: number;
  cache: Cache;
  chain: "devnet" | "zeko" | "mainnet";
}): Promise<boolean> {
  const { jobId, endTime, cache, chain } = params;
  if (!adminSecretKey) {
    throw new Error("ADMIN_SECRET_KEY is not set");
  }
  if (!minaAdminSecretKey) {
    throw new Error("MINA_ADMIN_PRIVATE_KEY is not set");
  }
  const config = await getConfig();
  const poolPublicKey = config.mina_contract;
  if (!poolPublicKey) {
    throw new Error("Mina contract is not set");
  }
  await initBlockchain(chain);
  const dexContract = new DEXContract(PublicKey.fromBase58(poolPublicKey));
  let daTx = await checkDataAvailability({
    adminKey: adminSecretKey,
    verbose: true,
    cache,
  });
  if (daTx && daTx.blobId && daTx.digest && daTx.blockNumber) {
    data_availability.push({
      block_number: daTx.blockNumber,
      data_availability: daTx.blobId,
      data_availability_digest: daTx.digest,
    });
  }
  while (daTx && Date.now() < endTime) {
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
    if (daTx) console.log("daTx", daTx);
    if (daTx && daTx.blobId && daTx.digest && daTx.blockNumber !== undefined) {
      data_availability.push({
        block_number: daTx.blockNumber,
        data_availability: daTx.blobId,
        data_availability_digest: daTx.digest,
      });
    } else if (daTx) {
      console.error("daTx is missing some fields", daTx);
    }
  }
  if (Date.now() > endTime) {
    return true;
  }
  const isDeployed = await checkMinaContractDeployment({
    contractAddress: poolPublicKey,
    adminPublicKey: PrivateKey.fromBase58(minaAdminSecretKey)
      .toPublicKey()
      .toBase58(),
  });

  if (!isDeployed) return false;
  await fetchMinaAccount({ publicKey: poolPublicKey, force: true });
  const contractBlockNumber = Number(dexContract.blockNumber.get().toBigInt());
  if (contractBlockNumber + 1 > currentMinaBlockNumber) {
    currentMinaBlockNumber = contractBlockNumber + 1;
  }
  console.log("contractBlockNumber", contractBlockNumber);
  let includedBlockNumber = contractBlockNumber;
  let includedBlock = await fetchBlock({ blockNumber: includedBlockNumber });
  while (
    includedBlockNumber >= 0 &&
    includedBlock.block.mina_tx_hash !== null &&
    !includedBlock.block.mina_tx_included_in_block
  ) {
    await submitMinaTxInclusion({
      blockNumber: includedBlockNumber,
      timestamp: Date.now(),
    });
    includedBlockNumber--;
    if (includedBlockNumber >= 0) {
      includedBlock = await fetchBlock({ blockNumber: includedBlockNumber });
    }
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
        settling = true;
        const settlementPromise = settleMinaContract({
          poolPublicKey,
          adminPrivateKey: minaAdminSecretKey,
          proof: state.dexProof,
          blobId: blockProof,
          chain,
          cache,
        });
        let daTx = await checkDataAvailability({
          adminKey: adminSecretKey,
          verbose: true,
          cache,
        });
        if (daTx) console.log("daTx", daTx);
        if (
          daTx &&
          daTx.blobId &&
          daTx.digest &&
          daTx.blockNumber !== undefined
        ) {
          data_availability.push({
            block_number: daTx.blockNumber,
            data_availability: daTx.blobId,
            data_availability_digest: daTx.digest,
          });
        } else if (daTx) {
          console.error("daTx is missing some fields", daTx);
        }
        while (daTx && Date.now() < endTime && settling) {
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
          if (daTx) console.log("daTx", daTx);
          if (
            daTx &&
            daTx.blobId &&
            daTx.digest &&
            daTx.blockNumber !== undefined
          ) {
            data_availability.push({
              block_number: daTx.blockNumber,
              data_availability: daTx.blobId,
              data_availability_digest: daTx.digest,
            });
          } else if (daTx) {
            console.error("daTx is missing some fields", daTx);
          }
        }
        const settlement = await settlementPromise;
        if (settlement) {
          currentMinaBlockNumber++;
          settlements.push(settlement);
          return true;
        }
      }
    }
  }
  if (await blockCreationNeeded()) {
    const blockResult = await checkBlockCreation({
      key: await getProverSecretKey(),
    });
    if (blockResult?.digest) {
      console.log("Waiting for block to be created:", {
        digest: blockResult.digest,
      });
      await waitTx(blockResult.digest);
      return true;
    }
  }
  return false;
}

export async function settleMinaContract(params: {
  poolPublicKey: string;
  adminPrivateKey: string;
  proof: DEXProof;
  blobId: string;
  chain: "devnet" | "zeko" | "mainnet";
  cache: Cache;
}): Promise<SettlementTransaction | undefined> {
  const { proof, blobId, chain, cache } = params;
  console.time("settle");
  try {
    settling = true;
    await getProverSecretKey();
    await initBlockchain(chain);

    const CONTRACT_VERIFICATION_KEY_HASH =
      process.env.CONTRACT_VERIFICATION_KEY_HASH;
    const CONTRACT_VERIFICATION_KEY_DATA =
      process.env.CONTRACT_VERIFICATION_KEY_DATA;

    if (!CONTRACT_VERIFICATION_KEY_HASH || !CONTRACT_VERIFICATION_KEY_DATA) {
      throw new Error(
        "CONTRACT_VERIFICATION_KEY_HASH or CONTRACT_VERIFICATION_KEY_DATA is not set"
      );
    }

    const verificationKey = new VerificationKey({
      hash: Field(BigInt(CONTRACT_VERIFICATION_KEY_HASH)),
      data: CONTRACT_VERIFICATION_KEY_DATA,
    });

    console.log("Compiling DEX Contract");
    console.time("compile");
    if (!vkContract || !vkProgram) {
      vkProgram = await compileDEXProgram(cache);
      const { verificationKey: vkc } = await DEXContract.compile({ cache });
      vkContract = vkc;
    }
    if (
      vkContract.data !== verificationKey.data ||
      vkContract.hash.toJSON() !== verificationKey.hash.toJSON()
    ) {
      throw new Error("Verification key mismatch");
    }
    console.timeEnd("compile");

    const adminPrivateKey = PrivateKey.fromBase58(params.adminPrivateKey);
    const admin = adminPrivateKey.toPublicKey();
    const poolPublicKey = PublicKey.fromBase58(params.poolPublicKey);
    const pool = poolPublicKey;

    console.log("DEX contract address:", pool.toBase58());

    console.log(
      "Admin",
      admin.toBase58(),
      "balance:",
      await accountBalanceMina(admin)
    );

    const dex = new DEXContract(pool);
    const startTx = Number(proof.publicInput.sequence.toBigInt()) + 1;
    const endTx = Number(proof.publicOutput.sequence.toBigInt());
    const txs_number = endTx - startTx + 1;
    const blockNumber = Number(proof.publicInput.blockNumber.toBigInt());
    console.log("blockNumber", blockNumber);
    const memo = `block ${blockNumber} (${txs_number} ${
      txs_number === 1 ? "tx" : "txs"
    }: ${startTx} - ${endTx})`.substring(0, 30);
    console.log("memo", memo);

    if (!vkProgram) {
      throw new Error("Verification key is not set");
    }

    const ok = await verify(proof, vkProgram);
    console.log("ok", ok);
    if (!ok) {
      throw new Error("Proof is not valid");
    }

    const submitted = await submitBlockProofDataAvailability({
      blockNumber,
      blobId,
    });
    if (!submitted) {
      throw new Error("Failed to submit block proof data availability");
    }
    let apiNonce = 0;
    try {
      apiNonce = (await getNonce({ address: admin.toBase58(), chain })) ?? 0;
    } catch (e: any) {
      console.log("Failed to get nonce from API", e?.message);
    }
    await fetchMinaAccount({ publicKey: pool, force: true });
    await fetchMinaAccount({ publicKey: admin, force: true });

    const o1jsNonce = Number(Mina.getAccount(admin).nonce.toBigint());
    nonce = Math.max(nonce, apiNonce ?? 0, o1jsNonce);

    const tx = await Mina.transaction(
      {
        sender: admin,
        fee: 100_000_000,
        memo,
        nonce,
      },
      async () => {
        await dex.settle(proof);
      }
    );
    await tx.prove();
    const auProofs = tx?.transaction?.accountUpdates
      .map((au) => au?.authorization?.proof)
      .filter((p) => p !== undefined);
    const sentTx = await sendTx({
      tx: tx.sign([adminPrivateKey]),
      description: "settle",
      wait: false,
      verbose: true,
    });

    if (sentTx?.status !== expectedTxStatus) {
      console.error("sentTx", sentTx);
      throw new Error(`Deploy DEX Contract failed: ${sentTx?.status}`);
    }
    nonce++;
    const hash = sentTx?.hash;
    const auPromise = saveToDA({
      data: sentTx.toJSON(),
      description: "settle",
      days: 50,
      filename: "settleTx.json",
    });

    Memory.info("sent Mina Tx");
    const coordinationHash = await submitMinaTx({
      blockNumber,
      minaTx: hash,
    });
    const au = await auPromise;
    settling = false;
    console.timeEnd("settle");
    return {
      blockNumber,
      number_of_transactions: txs_number,
      sequences: [startTx, endTx],
      settlement_hash: hash,
      nonce,
      proof_data_availability: submitted?.blobId,
      proof_data_availability_digest: submitted?.digest,
      au_proof_data_availability: au,
      coordination_hash: coordinationHash,
    };
  } catch (e: any) {
    console.error("Error in settleMinaContract", e.message);
    settling = false;
    console.timeEnd("settle");
    return undefined;
  }
}
