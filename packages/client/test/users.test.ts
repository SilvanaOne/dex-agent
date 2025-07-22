import { describe, it } from "node:test";
import assert from "node:assert";
import { Transaction } from "@mysten/sui/transactions";
import { getKey } from "@dex-agent/lib";
import { readFile } from "node:fs/promises";
import { suiClient } from "@dex-agent/lib";
import { executeTx, waitTx } from "@dex-agent/lib";
import { publicKeyToU256 } from "@dex-agent/lib";
import { DexObjects } from "./helpers/dex.js";

// const userSecretKeys: string[] = [
//   process.env.SECRET_KEY_1!,
//   process.env.SECRET_KEY_2!,
//   process.env.SECRET_KEY_3!,
// ];
const adminSecretKey: string = process.env.ADMIN_SECRET_KEY!;
const validatorSecretKey: string = process.env.VALIDATOR_SECRET_KEY!;
//const proverSecretKey: string = process.env.PROVER_SECRET_KEY!;

if (!adminSecretKey || !validatorSecretKey) {
  throw new Error("Missing environment variables");
}
// userSecretKeys.map((secretKey) => {
//   if (!secretKey) {
//     throw new Error("Missing environment variables");
//   }
// });

const packageID = process.env.PACKAGE_ID;
const dexID = process.env.DEX_ID;
const adminID = process.env.ADMIN_ID;
let dexObjects: DexObjects | undefined = undefined;

describe("Create users", async () => {
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

  it("should create users", async () => {
    if (!packageID) {
      throw new Error("PACKAGE_ID is not set");
    }

    if (!dexID) {
      throw new Error("DEX_ID is not set");
    }

    if (!dexObjects) {
      throw new Error("DEX_OBJECTS is not set");
    }

    if (!adminID) {
      throw new Error("ADMIN_ID is not set");
    }

    const { address, keypair } = await getKey({
      secretKey: adminSecretKey,
      name: "admin",
      minBalance: 1,
      topupAmount: 5,
    });

    const { faucet, liquidityProvider, alice, bob } = dexObjects;
    const tx = new Transaction();

    /*
      public fun create_account(
          dex: &mut DEX,
          publicKey: u256,
          publicKeyBase58: String,
          role: String,
          image: String,
          name: String,
          baseBalance: u64,
          quoteBalance: u64,
          ctx: &mut TxContext,
    */

    const faucetAccountArguments = [
      tx.object(dexID),
      tx.pure.u256(publicKeyToU256(faucet.minaPublicKey)),
      tx.pure.string(faucet.minaPublicKey),
      tx.pure.string(faucet.role),
      tx.pure.string(faucet.image),
      tx.pure.string(faucet.name),
      tx.pure.u64(faucet.account.baseTokenBalance.amount),
      tx.pure.u64(faucet.account.quoteTokenBalance.amount),
    ];

    tx.moveCall({
      package: packageID,
      module: "transactions",
      function: "create_account",
      arguments: faucetAccountArguments,
    });

    const liquidityProviderAccountArguments = [
      tx.object(dexID),
      tx.pure.u256(publicKeyToU256(liquidityProvider.minaPublicKey)),
      tx.pure.string(liquidityProvider.minaPublicKey),
      tx.pure.string(liquidityProvider.role),
      tx.pure.string(liquidityProvider.image),
      tx.pure.string(liquidityProvider.name),
      tx.pure.u64(liquidityProvider.account.baseTokenBalance.amount),
      tx.pure.u64(liquidityProvider.account.quoteTokenBalance.amount),
    ];

    tx.moveCall({
      package: packageID,
      module: "transactions",
      function: "create_account",
      arguments: liquidityProviderAccountArguments,
    });

    const aliceAccountArguments = [
      tx.object(dexID),
      tx.pure.u256(publicKeyToU256(alice.minaPublicKey)),
      tx.pure.string(alice.minaPublicKey),
      tx.pure.string(alice.role),
      tx.pure.string(alice.image),
      tx.pure.string(alice.name),
      tx.pure.u64(alice.account.baseTokenBalance.amount),
      tx.pure.u64(alice.account.quoteTokenBalance.amount),
    ];

    tx.moveCall({
      package: packageID,
      module: "transactions",
      function: "create_account",
      arguments: aliceAccountArguments,
    });

    const bobAccountArguments = [
      tx.object(dexID),
      tx.pure.u256(publicKeyToU256(bob.minaPublicKey)),
      tx.pure.string(bob.minaPublicKey),
      tx.pure.string(bob.role),
      tx.pure.string(bob.image),
      tx.pure.string(bob.name),
      tx.pure.u64(bob.account.baseTokenBalance.amount),
      tx.pure.u64(bob.account.quoteTokenBalance.amount),
    ];

    tx.moveCall({
      package: packageID,
      module: "transactions",
      function: "create_account",
      arguments: bobAccountArguments,
    });

    tx.setSender(address);
    tx.setGasBudget(100_000_000);
    // const signedTx = await tx.sign({
    //   signer: keypair,
    //   client: suiClient,
    // });

    const result = await executeTx({
      tx,
      keyPair: keypair,
    });
    if (!result) {
      throw new Error("Failed to create users");
    }
    const { tx: createUsersTx, digest, events } = result;
    console.log("Created users:", {
      digest,
      events,
    });
    const waitResult = await waitTx(digest);
    if (waitResult.errors) {
      console.log(`Errors for tx ${digest}:`, waitResult.errors);
    }
    assert.ok(!waitResult.errors, "create users transaction failed");
  });
});
