"use server";
import { getConfig } from "./config.js";
import { Transaction } from "@mysten/sui/transactions";
import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui/utils";
import { getKey } from "./key.js";
import { executeOperationTx } from "./operaton.js";
import { LastTransactionData, Operation } from "./types.js";
import { fetchDex, fetchBlock } from "./fetch.js";
const TOPUP_AMOUNT = 10;
const MIN_SUI_BALANCE = 6;

export async function getDataAvailabilityBlock(verbose = false): Promise<
  | {
      blockNumber: number;
    }
  | undefined
> {
  const dex = await fetchDex();
  if (!dex) {
    console.log("Cannot fetch DEX");
    return undefined;
  }
  let lastBlockNumber: number | undefined = undefined;
  let blockNumber = dex.block_number - 1;
  while (!lastBlockNumber && blockNumber >= 0) {
    if (verbose) {
      console.log("getDataAvailability: fetching block", blockNumber);
    }
    const blockData = await fetchBlock({ blockNumber });
    if (
      blockData.block.state_data_availability !== undefined &&
      blockData.block.state_data_availability !== null &&
      blockData.block.state_data_availability !== ""
    ) {
      lastBlockNumber = blockNumber + 1;
      //blockBlobId = blockData.block.state_data_availability;
    } else {
      blockNumber--;
    }
  }
  if (lastBlockNumber === dex.block_number) lastBlockNumber = undefined;

  if (verbose) {
    console.log(`getDataAvailability: block number:`, lastBlockNumber);
  }
  if (!lastBlockNumber) {
    if (verbose) {
      console.log("getDataAvailability: no block number found");
    }
    return undefined;
  }
  return {
    blockNumber: lastBlockNumber,
  };
}

export async function addDataAvailability(params: {
  blockNumber: number;
  blockBlobId: string;
  adminKey: string;
  verbose: boolean;
  useParallelExecutor?: boolean;
}): Promise<Partial<LastTransactionData> | undefined> {
  const {
    blockNumber,
    blockBlobId,
    adminKey,
    verbose,
    useParallelExecutor = false,
  } = params;
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

  const tx = new Transaction();

  const blockArguments = [
    tx.object(dexID),
    tx.pure.u64(blockNumber),
    tx.pure.string(blockBlobId),
    tx.object(SUI_CLOCK_OBJECT_ID),
  ];

  tx.moveCall({
    package: packageID,
    module: "main",
    function: "update_block_state_data_availability",
    arguments: blockArguments,
  });

  const { address, keypair } = await getKey({
    secretKey: adminKey,
    name: "admin",
    minBalance: MIN_SUI_BALANCE,
    topupAmount: TOPUP_AMOUNT,
  });

  tx.setSender(address);
  tx.setGasBudget(100_000_000);

  const end = Date.now();
  const prepareTime = end - start;
  const result = await executeOperationTx({
    operation: Operation.DATA_AVAILABILITY,
    tx,
    keyPair: keypair,
    useParallelExecutor,
  });
  if (!result) {
    return undefined;
  }
  if (verbose) {
    console.log("Data availability:", result);
  }

  return {
    ...result,
    prepareTime,
  };
}
