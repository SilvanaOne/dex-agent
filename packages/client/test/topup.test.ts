import { describe, it } from "node:test";
import assert from "node:assert";

import { Transaction } from "@mysten/sui/transactions";
import { readFile } from "node:fs/promises";
import {
  suiClient,
  executeTx,
  waitTx,
  getKey,
  signDexFields,
  wrapMinaSignature,
  publicKeyToU256,
  Operation,
  UserTradingAccount,
  fetchDexAccount,
} from "@dex-agent/lib";
import { DexObjects } from "./helpers/dex.js";

const adminSecretKey: string = process.env.ADMIN_SECRET_KEY!;

if (!adminSecretKey) {
  throw new Error("Missing environment variables");
}

const packageID = process.env.PACKAGE_ID;
const dexID = process.env.DEX_ID;
let dexObjects: DexObjects | undefined = undefined;

describe("Topup DEX users", async () => {
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

  it("should topup user accounts", async () => {
    if (!packageID) {
      throw new Error("PACKAGE_ID is not set");
    }

    if (!dexID) {
      throw new Error("DEX_ID is not set");
    }

    if (!dexObjects) {
      throw new Error("DEX_OBJECTS is not set");
    }
    const { faucet, alice, bob, pool } = dexObjects;
    if (!faucet.minaPrivateKey) {
      throw new Error("FAUCET_PRIVATE_KEY is not set");
    }

    const { address, keypair } = await getKey({
      secretKey: adminSecretKey,
      name: "faucet",
    });

    const faucetAccount = await fetchDexAccount({
      addressU256: publicKeyToU256(faucet.minaPublicKey),
    });
    const aliceAccount = await fetchDexAccount({
      addressU256: publicKeyToU256(alice.minaPublicKey),
    });
    const bobAccount = await fetchDexAccount({
      addressU256: publicKeyToU256(bob.minaPublicKey),
    });
    if (!faucetAccount || !aliceAccount || !bobAccount) {
      throw new Error("Cannot fetch accounts");
    }
    let nonce = faucetAccount.nonce;

    const tx = new Transaction();

    for (const user of [alice, bob]) {
      const baseTokenAmount = 10_000_000_000n;
      const quoteTokenAmount = 20_000_000_000_000n;

      const faucetSignature = await signDexFields({
        minaPrivateKey: faucet.minaPrivateKey,
        poolPublicKey: pool.minaPublicKey,
        operation: Operation.TRANSFER,
        nonce,
        baseTokenAmount,
        quoteTokenAmount,
        receiverPublicKey: user.minaPublicKey,
      });

      const { minaSignature, suiSignature } = await wrapMinaSignature({
        minaSignature: faucetSignature.minaSignatureBase58,
        minaPublicKey: faucet.minaPublicKey,
        poolPublicKey: pool.minaPublicKey,
        operation: Operation.TRANSFER,
        nonce,
        baseTokenAmount,
        quoteTokenAmount,
        receiverPublicKey: user.minaPublicKey,
      });
      nonce++;

      /*
          public fun transfer(
              dex: &mut DEX,
              senderPublicKey: u256,
              receiverPublicKey: u256,
              baseTokenAmount: u64,
              quoteTokenAmount: u64,
              senderSignature_r: u256,
              senderSignature_s: u256,
              validatorSignature: vector<u8>,
      */

      const signatureLength = suiSignature.length;
      console.log("signatureLength", signatureLength);
      if (signatureLength !== 64) {
        throw new Error("Invalid signature length");
      }

      const userTopupArguments = [
        tx.object(dexID),
        tx.pure.u256(publicKeyToU256(faucet.minaPublicKey)),
        tx.pure.u256(publicKeyToU256(user.minaPublicKey)),
        tx.pure.u64(baseTokenAmount),
        tx.pure.u64(quoteTokenAmount),
        tx.pure.u256(minaSignature.r),
        tx.pure.u256(minaSignature.s),
        tx.pure.vector("u8", suiSignature),
      ];

      tx.moveCall({
        package: packageID,
        module: "transactions",
        function: "transfer",
        arguments: userTopupArguments,
      });
    }
    tx.setSender(address);
    tx.setGasBudget(10_000_000);

    // const signedTx = await tx.sign({
    //   signer: keypair,
    //   client: suiClient,
    // });

    const result = await executeTx({
      tx,
      keyPair: keypair,
    });
    if (!result) {
      throw new Error("Failed to topup users");
    }
    const { tx: topupTx, digest, events } = result;
    console.log("Topup users:", {
      digest,
      events,
    });
    const waitResult = await waitTx(digest);
    if (waitResult.errors) {
      console.log(`Errors for tx ${digest}:`, waitResult.errors);
    }
    assert.ok(!waitResult.errors, "topup transaction failed");

    const newFaucetAccount = await fetchDexAccount({
      addressU256: publicKeyToU256(faucet.minaPublicKey),
    });
    const newAliceAccount = await fetchDexAccount({
      addressU256: publicKeyToU256(alice.minaPublicKey),
    });
    const newBobAccount = await fetchDexAccount({
      addressU256: publicKeyToU256(bob.minaPublicKey),
    });
    if (!newFaucetAccount || !newAliceAccount || !newBobAccount) {
      throw new Error("Cannot fetch accounts");
    }
    compareAccounts({
      name: "Faucet",
      before: faucetAccount,
      after: newFaucetAccount,
    });
    compareAccounts({
      name: "Alice",
      before: aliceAccount,
      after: newAliceAccount,
    });
    compareAccounts({
      name: "Bob",
      before: bobAccount,
      after: newBobAccount,
    });
  });
});

function compareAccounts(params: {
  name: string;
  before: UserTradingAccount;
  after: UserTradingAccount;
}) {
  const { name, before, after } = params;
  const baseBefore = before.baseTokenBalance.amount;
  const baseAfter = after.baseTokenBalance.amount;
  const quoteBefore = before.quoteTokenBalance.amount;
  const quoteAfter = after.quoteTokenBalance.amount;
  console.log(
    `${name} base token balance: ${baseBefore / 1_000_000_000n} -> ${
      baseAfter / 1_000_000_000n
    }`
  );
  console.log(
    `${name} quote token balance: ${quoteBefore / 1_000_000_000n} -> ${
      quoteAfter / 1_000_000_000n
    }`
  );
}
