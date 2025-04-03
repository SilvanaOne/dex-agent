"use server";
import { getConfig } from "./config.js";
import { publicKeyToU256 } from "./public-key.js";
import { Transaction } from "@mysten/sui/transactions";
import { getKey } from "./key.js";
import { executeOperationTx } from "./operaton.js";
import { LastTransactionData, Operation } from "./types.js";

export async function createAccount(params: {
  user: string;
  key?: string;
}): Promise<Partial<LastTransactionData>> {
  const { user, key } = params;
  const start = Date.now();
  const config = await getConfig();
  const packageID = config.dex_package;
  const dexID = config.dex_object;

  if (!packageID) {
    throw new Error("PACKAGE_ID is not set");
  }

  if (!dexID) {
    throw new Error("DEX_ID is not set");
  }

  const { address, keypair } = await getKey({
    secretKey: key,
    name: "user",
  });

  const tx = new Transaction();

  const userAccountArguments = [
    tx.object(dexID),
    tx.pure.u256(publicKeyToU256(user)),
    tx.pure.string(user),
    tx.pure.string("user"),
    tx.pure.string(
      "https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png"
    ),
    tx.pure.string(user),
    tx.pure.u64(0n),
    tx.pure.u64(0n),
  ];

  tx.moveCall({
    package: packageID,
    module: "transactions",
    function: "create_account",
    arguments: userAccountArguments,
  });

  tx.setSender(address);
  tx.setGasBudget(100_000_000);

  const end = Date.now();
  const prepareTime = end - start;
  const result = await executeOperationTx({
    operation: Operation.CREATE_ACCOUNT,
    tx,
    keyPair: keypair,
  });
  console.log("Created user:", result);
  return { ...result, prepareTime };
}
