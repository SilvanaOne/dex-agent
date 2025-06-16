"use server";
import { getConfig } from "./config.js";
import { publicKeyToU256 } from "./public-key.js";
import { Transaction } from "@mysten/sui/transactions";
import { getKey } from "./key.js";
import { executeOperationTx } from "./operaton.js";
import { fetchDexAccount } from "./fetch.js";
import { signDexFields } from "./sign.js";
import { wrapMinaSignature } from "./wrap.js";
import { LastTransactionData, Operation } from "./types.js";

const faucetPublicKey: string =
  process.env.NEXT_PUBLIC_FAUCET_PUBLIC_KEY ||
  process.env.MINA_FAUCET_PUBLIC_KEY!;

const faucetPrivateKey: string =
  process.env.FAUCET_PRIVATE_KEY || process.env.MINA_FAUCET_PRIVATE_KEY!;

export async function faucet(params: {
  user: string;
  key?: string;
}): Promise<Partial<LastTransactionData>> {
  try {
    const { user, key } = params;
    if (!faucetPublicKey) {
      throw new Error("FAUCET PUBLIC KEY is not set");
    }

    if (!faucetPrivateKey) {
      throw new Error("FAUCET PRIVATE KEY is not set");
    }

    const start = Date.now();
    const config = await getConfig();
    const u256 = publicKeyToU256(user);
    const packageID = config.dex_package;
    const poolPublicKey = config.mina_contract;
    const dexID = config.dex_object;
    if (!packageID) {
      throw new Error("PACKAGE_ID is not set");
    }

    if (!dexID) {
      throw new Error("DEX_ID is not set");
    }

    if (!poolPublicKey) {
      throw new Error("POOL PUBLIC KEY is not set");
    }

    const { address, keypair } = await getKey({
      secretKey: key,
      name: "user",
    });

    const faucetU256 = publicKeyToU256(faucetPublicKey);

    const faucetAccount = await fetchDexAccount({
      addressU256: faucetU256,
    });
    const userAccount = await fetchDexAccount({ addressU256: u256 });
    if (!faucetAccount || !userAccount) {
      throw new Error("Cannot fetch accounts");
    }
    let nonce = faucetAccount.nonce;

    const tx = new Transaction();

    const baseTokenAmount = 1_000_000_000n;
    const quoteTokenAmount = 2_000_000_000_000n;

    const faucetSignature = await signDexFields({
      minaPrivateKey: faucetPrivateKey,
      poolPublicKey: poolPublicKey,
      operation: Operation.TRANSFER,
      nonce,
      baseTokenAmount,
      quoteTokenAmount,
      receiverPublicKey: user,
    });

    const { minaSignature, suiSignature } = await wrapMinaSignature({
      minaSignature: faucetSignature.minaSignatureBase58,
      minaPublicKey: faucetPublicKey,
      poolPublicKey: poolPublicKey,
      operation: Operation.TRANSFER,
      nonce,
      baseTokenAmount,
      quoteTokenAmount,
      receiverPublicKey: user,
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

    const userTopupArguments = [
      tx.object(dexID),
      tx.pure.u256(publicKeyToU256(faucetPublicKey)),
      tx.pure.u256(publicKeyToU256(user)),
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

    tx.setSender(address);
    tx.setGasBudget(10_000_000);

    const end = Date.now();
    const prepareTime = end - start;
    const result = await executeOperationTx({
      operation: Operation.TRANSFER,
      tx,
      keyPair: keypair,
    });
    console.log("Faucet:", result);

    return {
      ...result,
      prepareTime,
    };
  } catch (error: any) {
    console.error("Faucet error:", error.message);
    return {
      errors: [error.message],
    };
  }
}
