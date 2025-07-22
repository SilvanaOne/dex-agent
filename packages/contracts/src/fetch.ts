import {
  fetchBlock,
  fetchDexEvents,
  fetchDex,
  BlockData,
  fetchBlockState,
} from "@dex-agent/lib";
import { SequenceState, DEXAccountProof } from "./contracts/index.js";
import { deserializeIndexedMerkleMap } from "@silvana-one/storage";
import {
  DEXMap,
  ProvableBlockData,
  RollupUserTradingAccount,
} from "./types/provable-types.js";
import { readFromDA } from "@dex-agent/lib";
import { calculateState, createAccountProof } from "./state.js";
import { getIDs } from "./id.js";
import { Cache, PublicKey } from "o1js";

export async function fetchSequenceData(params: {
  sequence: number;
  blockNumber: number;
  prove?: boolean;
  accountProof?: boolean;
  address?: string;
  cache: Cache;
}): Promise<
  | {
      state: SequenceState;
      dexAccountProof?: DEXAccountProof;
      proofPublicOutput?: RollupUserTradingAccount;
    }
  | undefined
> {
  const {
    sequence,
    blockNumber,
    prove = false,
    accountProof = false,
    address,
    cache,
  } = params;
  try {
    if (accountProof && !address) {
      throw new Error("Address is not set, but account proof is requested");
    }
    //console.log("fetchSequenceData", { sequence, blockNumber, prove });
    const { dexID } = await getIDs();
    if (!dexID) {
      throw new Error("DEX_ID is not set");
    }
    if (!blockNumber || blockNumber < 1) {
      throw new Error("Incorrect block number");
    }
    let previousBlockNumber = blockNumber - 1;
    //console.log("fetching dex data", dexID);
    const dex = await fetchDex();
    //console.log("dex", dex);
    if (!dex) {
      throw new Error("DEX_DATA is not received");
    }
    const poolPublicKey = dex.poolPublicKey;
    if (!poolPublicKey) {
      throw new Error("Pool public key is not received");
    }
    //let previousBlockAddress = dexData?.previous_block_address;
    console.log("fetching block", previousBlockNumber);
    let blockData = await fetchBlock({
      blockNumber: previousBlockNumber,
    });
    while (
      blockData?.block?.state_data_availability === undefined ||
      blockData?.block?.state_data_availability === null ||
      blockData?.block?.state_data_availability === ""
    ) {
      previousBlockNumber--;
      if (previousBlockNumber < 0) {
        throw new Error("Previous block number is not correct");
      }
      //console.log("fetching previous block", previousBlockNumber);
      blockData = await fetchBlock({ blockNumber: previousBlockNumber });
    }
    // if (blockData?.block?.block_number > previousBlockNumber) {
    //   throw new Error("Fetched block number is not correct");
    // }
    const dataAvailability = blockData?.block?.state_data_availability;
    if (!dataAvailability) {
      throw new Error("Data availability is not received");
    }
    const data = await readFromDA({
      blobId: dataAvailability,
    });
    if (!data) {
      throw new Error("Data is not received from walrus");
    }
    const daBlockData: ProvableBlockData = ProvableBlockData.deserialize(data);
    const blockState = daBlockData?.state;
    if (!blockState) {
      throw new Error("Block state is not received");
    }
    const serializedMap = daBlockData?.map;

    if (!serializedMap) {
      throw new Error("Serialized map is not received");
    }
    const map = deserializeIndexedMerkleMap({
      serializedIndexedMap: serializedMap,
      type: DEXMap,
    });
    if (!map) {
      throw new Error("Map cannot be deserialized");
    }

    const events = await fetchDexEvents({
      firstSequence: blockData?.block?.end_sequence + 1,
      lastSequence: sequence,
    });
    if (!events) {
      throw new Error("Events are not received");
    }
    //console.log("events", events);

    if (accountProof) {
      if (!address) {
        throw new Error("Address is not set, but account proof is requested");
      }
      const state = await calculateState({
        poolPublicKey,
        blockNumber,
        sequence: sequence,
        serializedMap,
        block: blockData.block,
        blockState: blockState,
        operations: events,
        prove: false,
        cache,
      });
      console.log("state", state.sequences);
      const { dexAccountProof, proofPublicOutput } = await createAccountProof({
        address: PublicKey.fromBase58(address),
        dexState: state.dexState,
        map: state.map,
        account: state.accounts[address],
        prove: true,
        cache,
      });
      return { state, dexAccountProof, proofPublicOutput };
    } else {
      const state = await calculateState({
        poolPublicKey,
        blockNumber,
        sequence,
        serializedMap,
        block: blockData.block,
        blockState: blockState,
        operations: events,
        prove,
        cache,
      });

      return { state };
    }
  } catch (error: any) {
    console.error("fetchSequenceData error:", error?.message);
    return undefined;
  }
}
