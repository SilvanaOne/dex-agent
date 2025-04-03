import {
  LastTransactionData,
  getDataAvailabilityBlock,
  addDataAvailability,
  readFromDA,
  fetchBlock,
  saveToDA,
} from "@dex-agent/lib";
import { ProvableBlockData } from "./types/provable-types.js";
import { getKey } from "@dex-agent/lib";
import { fetchSequenceData } from "@dex-agent/contracts";
import { serializeIndexedMap } from "@silvana-one/storage";
import { calculateStateRoot } from "@dex-agent/contracts";
import { Cache } from "o1js";

export async function checkDataAvailability(params: {
  adminKey: string;
  verbose?: boolean;
  cache: Cache;
}): Promise<Partial<LastTransactionData> | undefined> {
  try {
    const { verbose = false, adminKey, cache } = params;
    const { address, keypair } = await getKey({
      secretKey: adminKey,
      name: "admin",
    });
    const daBlock = await getDataAvailabilityBlock(verbose);
    if (!daBlock || !daBlock.blockNumber) {
      if (verbose) {
        console.log("No block number found");
      }
      return undefined;
    }
    const blockNumber = daBlock.blockNumber;

    const blockData = await fetchBlock({
      blockNumber,
      fetchState: true,
      fetchEvents: true,
    });
    if (!blockData.state) {
      throw new Error("block state is not set");
    }
    if (!blockData.events) {
      throw new Error("block events are not set");
    }
    const sequenceData = await fetchSequenceData({
      sequence: blockData.block.block_state.sequence,
      blockNumber: blockData.block.block_number,
      cache,
    });
    if (!sequenceData) {
      throw new Error("sequence data is not set");
    }
    const root = await calculateStateRoot({
      state: blockData.state.state,
    });
    if (root !== sequenceData.map.root.toBigInt()) {
      throw new Error("state root does not match");
    }
    const provableBlockData: ProvableBlockData = new ProvableBlockData({
      ...blockData,
      state: blockData.state,
      events: blockData.events,
      map: serializeIndexedMap(sequenceData.map),
    });
    const blockBlobId = await saveToDA({
      data: provableBlockData.serialize(),
      address,
      days: 100,
      filename: `dex-block${blockNumber}.json`,
      description: `block ${blockNumber}`,
    });
    console.log(`block blobId:`, blockBlobId);

    if (!blockBlobId) {
      console.error("Error saving block to Walrus");
      return undefined;
    }

    const block = await readFromDA({
      blobId: blockBlobId,
    });
    if (!block) {
      console.error("Error reading block from Walrus");
      return undefined;
    }
    try {
      const blockData = ProvableBlockData.deserialize(block);
    } catch (error: any) {
      console.error("Error deserializing block:", error.message);
      return undefined;
    }
    const result = await addDataAvailability({
      blockNumber,
      blockBlobId,
      adminKey,
      verbose,
      useParallelExecutor: true,
    });
    if (!result) {
      return undefined;
    }
    return {
      ...result,
      blobId: blockBlobId,
    };
  } catch (error: any) {
    console.error("Error checking data availability:", error.message);
    return undefined;
  }
}
