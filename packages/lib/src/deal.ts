"use server";
import { getConfig } from "./config.js";
import { publicKeyToU256 } from "./public-key.js";
import { Transaction } from "@mysten/sui/transactions";
import { getKey, getUserKey } from "./key.js";
import { executeOperationTx } from "./operaton.js";
import { Deal, Operation } from "./types.js";
import { LastTransactionData } from "./types.js";
import { findDeal, getOrderbook } from "./orderbook.js";
import { fetchDex } from "./fetch.js";

export async function checkDeals(params: {
  key?: string;
  verbose?: boolean;
  useParallelExecutor?: boolean;
}): Promise<Partial<LastTransactionData> | undefined> {
  try {
    const { verbose = false, key, useParallelExecutor = false } = params;
    const dex = await fetchDex();
    if (!dex) {
      console.log("DEX not found");
      return undefined;
    }
    const orderbook = getOrderbook(dex);
    const deal = findDeal({ dex, orderbook });
    if (!deal) {
      console.log("No deal to settle");
      return undefined;
    }
    return await settleDeal({ deal, key, verbose, useParallelExecutor });
  } catch (error: any) {
    console.error("Error checking deals:", error.message);
    return undefined;
  }
}

export async function settleDeal(params: {
  deal: Deal;
  key?: string;
  verbose: boolean;
  useParallelExecutor?: boolean;
}): Promise<Partial<LastTransactionData> | undefined> {
  try {
    const { deal, verbose, useParallelExecutor = false } = params;
    const start = Date.now();
    let keyPromise: Promise<string> | undefined = undefined;
    if (params.key) {
      keyPromise = undefined;
    } else {
      keyPromise = getUserKey();
    }
    const config = await getConfig();
    const packageID = config.dex_package;
    const dexID = config.dex_object;
    if (!packageID) {
      throw new Error("PACKAGE_ID is not set");
    }

    if (!dexID) {
      throw new Error("DEX_ID is not set");
    }

    /*
        public fun trade(
            dex: &mut DEX,
            buyerPublicKey: u256,
            sellerPublicKey: u256,
            baseTokenAmount: u64,
            quoteTokenAmount: u64,
        ) {
  */
    const tx = new Transaction();

    const tradeArguments = [
      tx.object(dexID),
      tx.pure.u256(publicKeyToU256(deal.buyerPublicKey)),
      tx.pure.u256(publicKeyToU256(deal.sellerPublicKey)),
      tx.pure.u64(deal.baseTokenAmount),
      tx.pure.u64(deal.quoteTokenAmount),
    ];

    tx.moveCall({
      package: packageID,
      module: "transactions",
      function: "trade",
      arguments: tradeArguments,
    });

    const key = params.key ?? (await keyPromise);
    const { address, keypair } = await getKey({
      secretKey: key,
      name: "user",
    });

    tx.setSender(address);
    tx.setGasBudget(10_000_000);

    const end = Date.now();
    const prepareTime = end - start;
    const result = await executeOperationTx({
      operation: Operation.TRADE,
      tx,
      keyPair: keypair,
      useParallelExecutor,
    });
    console.log("Deal:", result);

    return {
      ...result,
      prepareTime,
    };
  } catch (error: any) {
    console.error("Error settling deal:", error.message);
    return undefined;
  }
}
