import { suiClient } from "./sui-client.js";
import {
  UserTradingAccount,
  OperationEvent,
  RawOperationEvent,
  RawBlock,
  Block,
  ProofStatusData,
  BlockProofs,
  BlockData,
  BlockState,
  DexObject,
  RawEvent,
  RollupEvent,
  MinaTransactionEvent,
} from "./types.js";
import {
  EventId,
  PaginatedEvents,
  SuiEvent,
  SuiEventFilter,
} from "@mysten/sui/client";
import { DexConfig, getConfig } from "./config.js";
import { convertRollupEvent, convertRawOperationEvent } from "./event.js";
import {
  rawBlockToBlock,
  rawBlockStateToBlockState,
  blockCreationNeeded,
} from "./block.js";
import { publicKeyToU256, u256ToPublicKey } from "./public-key.js";

export async function getDexID(): Promise<string> {
  const config = await getConfig();
  return config.dex_object;
}

export async function getPackageID(): Promise<string> {
  const config = await getConfig();
  return config.dex_package;
}
export async function fetchSuiObject(objectID: string) {
  const data = await suiClient.getObject({
    id: objectID,
    options: {
      showContent: true,
    },
  });
  return data;
}

export async function fetchDexObject() {
  const dexID = await getDexID();
  if (!dexID) {
    throw new Error("DEX_ID is not set");
  }
  const data = await suiClient.getObject({
    id: dexID,
    options: {
      showContent: true,
    },
  });
  return data;
}

export async function fetchDexVersion(): Promise<bigint> {
  const dexID = await getDexID();
  if (!dexID) {
    throw new Error("DEX_ID is not set");
  }
  const data = await suiClient.getObject({
    id: dexID,
  });
  return BigInt(data.data?.version ?? 0);
}

export async function fetchDex(): Promise<DexObject | undefined> {
  const dexObject = await fetchDexObject();
  const dexData = (dexObject?.data?.content as any)?.fields;
  if (!dexData) {
    throw new Error("DEX_DATA is not received");
  }
  return {
    ...dexData,
    block_number: Number(dexData.block_number),
    poolPublicKey: dexData.pool?.fields?.publicKeyBase58,
    last_proved_block_number: BigInt(dexData.last_proved_block_number),
    last_proved_sequence: BigInt(dexData.last_proved_sequence),
    previous_block_last_sequence: BigInt(dexData.previous_block_last_sequence),
    previous_block_timestamp: Number(dexData.previous_block_timestamp),
    sequence: BigInt(dexData.sequence),
    version: Number(dexData.version),
    dexObjectVersion: BigInt(dexObject.data?.version ?? 0),
    // console.log(
    //   "bids",
    //   dex?.pool?.fields?.bids?.fields.orders.fields.contents.map((c: any) => {
    //     return { key: c.fields.key, value: c.fields.value.fields };
    //   })
    // );
    bids: dexData?.pool?.fields?.bids?.fields?.orders?.fields?.contents.reduce(
      (acc: Record<string, { amount: bigint; price: bigint }>, c: any) => {
        const key = c?.fields?.key;
        const value = c?.fields?.value?.fields;
        const amount = value?.amount;
        const price = value?.price;
        if (!key || !amount || !price) {
          throw new Error("Invalid bid");
        }
        acc[u256ToPublicKey(BigInt(key))] = {
          amount: BigInt(amount),
          price: BigInt(price),
        };
        return acc;
      },
      {}
    ),
    offers: dexData?.pool?.fields?.offers?.fields.orders.fields.contents.reduce(
      (acc: Record<string, { amount: bigint; price: bigint }>, c: any) => {
        const key = c?.fields?.key;
        const value = c?.fields?.value?.fields;
        const amount = value?.amount;
        const price = value?.price;
        if (!key || !amount || !price) {
          throw new Error("Invalid offer");
        }
        acc[u256ToPublicKey(BigInt(key))] = {
          amount: BigInt(amount),
          price: BigInt(price),
        };
        return acc;
      },
      {}
    ),
    users: dexData?.pool?.fields?.users?.fields?.contents.map((u: string) =>
      u256ToPublicKey(BigInt(u))
    ),
    last_price: BigInt(dexData?.pool?.fields?.last_price),
  };
}

export async function fetchDexAccount(params: {
  addressU256: bigint;
}): Promise<UserTradingAccount | undefined> {
  const { addressU256 } = params;
  const dexID = await getDexID();
  if (!dexID) {
    throw new Error("DEX_ID is not set");
  }
  const publicKey = addressU256.toString();
  const poolData = (await fetchSuiObject(dexID)) as any;
  const accounts = poolData?.data?.content?.fields?.pool?.fields?.accounts;
  const id = accounts?.fields?.id?.id;
  const accountObject = await suiClient.getDynamicFieldObject({
    parentId: id,
    name: {
      type: "u256",
      value: publicKey,
    },
  });
  const account = accountObject.data?.content as any;
  if (account) {
    const data = account?.fields;
    const result: UserTradingAccount = {
      baseTokenBalance: {
        amount: BigInt(data?.baseTokenBalance?.fields?.amount),
        stakedAmount: BigInt(data?.baseTokenBalance?.fields?.stakedAmount),
        borrowedAmount: BigInt(data?.baseTokenBalance?.fields?.borrowedAmount),
      },
      quoteTokenBalance: {
        amount: BigInt(data?.quoteTokenBalance?.fields?.amount),
        stakedAmount: BigInt(data?.quoteTokenBalance?.fields?.stakedAmount),
        borrowedAmount: BigInt(data?.quoteTokenBalance?.fields?.borrowedAmount),
      },
      bid: {
        amount: BigInt(data?.bid?.fields?.amount),
        price: BigInt(data?.bid?.fields?.price),
        isSome: data?.bid?.fields?.isSome,
      },
      ask: {
        amount: BigInt(data?.ask?.fields?.amount),
        price: BigInt(data?.ask?.fields?.price),
        isSome: data?.ask?.fields?.isSome,
      },
      nonce: BigInt(data?.nonce),
    };
    return result;
  }

  return undefined;
}

export async function fetchEvents(params: {
  packageID: string;
  module: string;
  limit?: number;
  cursor?: EventId | null | undefined;
}): Promise<PaginatedEvents | undefined> {
  const { packageID, module, limit, cursor } = params;

  //console.time("queryEvents");
  try {
    const data = await suiClient.queryEvents({
      query: {
        MoveModule: {
          package: packageID,
          module,
        },
      },
      limit,
      order: "ascending",
      cursor: cursor,
    });
    //console.timeEnd("queryEvents");
    return data;
  } catch (error) {
    //console.timeEnd("queryEvents");
    console.error("error", error);
    return undefined;
  }
}

export async function fetchProofStatus(params: {
  sequence: number;
  blockNumber: number;
}): Promise<ProofStatusData | undefined> {
  const dexID = await getDexID();
  if (!dexID) {
    throw new Error("DEX_ID is not set");
  }
  const { sequence, blockNumber } = params;
  //console.log("fetchProofStatus", { sequence, blockNumber });
  const dex = await fetchDexObject();
  const dexData = (dex?.data?.content as any)?.fields?.proof_calculations.fields
    ?.id?.id;
  //console.log("dexData", dexData);
  if (!dexData || typeof dexData !== "string") {
    throw new Error("DEX_DATA is not received");
  }
  // const objects = await suiClient.getDynamicFields({
  //   parentId: dexData,
  // });
  // const index = objects.data.findIndex((item: any) => {
  //   return item?.name?.value === blockNumber.toString();
  // });
  // console.log("index", index);
  // if (index === -1) {
  //   throw new Error("Proof calculation is not found");
  // }
  const statuses = await suiClient.getDynamicFieldObject({
    parentId: dexData,
    name: {
      type: "u64",
      value: blockNumber.toString(),
    },
  });
  const items = (
    statuses.data?.content as any
  )?.fields?.proofs?.fields?.contents.map((item: any) => {
    return {
      sequences: item?.fields?.key,
      status: item?.fields?.value?.fields,
    };
  });
  const statusData = items.find((item: any) => {
    return (
      item?.sequences?.length === 1 &&
      item?.sequences[0] === sequence.toString()
    );
  });

  const status: ProofStatusData = {
    status: Number(statusData?.status?.status),
    timestamp: Number(statusData?.status?.timestamp),
    da_hash: statusData?.status?.da_hash,
  };
  return status;
}

export async function fetchBlock(params: {
  blockNumber: number;
  fetchState?: boolean;
  fetchEvents?: boolean;
}): Promise<BlockData> {
  const { blockNumber, fetchState = false, fetchEvents = false } = params;
  const dex = await fetchDexObject();
  //console.log("dex", dex);
  //console.log("dex.data", (dex?.data?.content as any)?.fields);
  const dexData = (dex?.data?.content as any)?.fields?.blocks?.fields?.id?.id;
  //console.log("blocks id", dexData);
  if (!dexData || typeof dexData !== "string") {
    throw new Error("DEX_DATA is not received");
  }
  const blocks = await suiClient.getDynamicFieldObject({
    parentId: dexData,
    name: {
      type: "u64",
      value: blockNumber.toString(),
    },
  });
  const rawBlock = (blocks.data?.content as any)?.fields as RawBlock;
  // return data;

  // const blockID = dex.blocks.fields.contents[blockNumber].fields.id.id;
  // const fetchedBlock = await fetchSuiObject(blockID);
  // const rawBlock = (fetchedBlock?.data?.content as any)?.fields as RawBlock;
  if (!rawBlock) {
    throw new Error(`raw block ${blockNumber} is not received`);
  }
  const block: Block = rawBlockToBlock(rawBlock);
  //console.log(`block:`, block);
  let blockEvents: OperationEvent[] | undefined = undefined;
  if (fetchEvents) {
    blockEvents = (
      await fetchDexEvents({
        firstSequence: block.start_sequence,
        lastSequence: block.end_sequence,
      })
    )?.filter((event) => {
      return event.operation.blockNumber === block.block_number;
    });
  }
  //console.log(`blockEvents:`, blockEvents);
  let blockState: BlockState | undefined = undefined;
  if (fetchState) {
    blockState = await fetchBlockState({ block });
  }
  const blockData: BlockData = {
    block,
    events: blockEvents,
    state: blockState,
  };
  return blockData;
}

export async function fetchBlockState(
  params:
    | {
        blockNumber: number;
      }
    | {
        block: Block;
      }
): Promise<BlockState> {
  let block: Block | undefined =
    ("block" in params && params.block) || undefined;
  if (!block && "blockNumber" in params) {
    block = (await fetchBlock({ blockNumber: params.blockNumber })).block;
  }
  if (!block) {
    throw new Error("Block is not received");
  }
  //console.log("block", block);
  const users = block.block_state.users;
  if (!users) {
    throw new Error("Users are not received");
  }
  const id = block.block_state.id;
  if (!id) {
    throw new Error("Block state id is not received");
  }
  const accounts: { address: string; account: any }[] = [];
  for (const user of users) {
    const account = await suiClient.getDynamicFieldObject({
      parentId: id,
      name: {
        type: "u256",
        value: publicKeyToU256(user).toString(),
      },
    });
    if (account) {
      accounts.push({
        address: user,
        account: account.data?.content as any,
      });
    } else {
      console.error("Account is not received", user);
      throw new Error("Account is not received");
    }
  }
  const blockState: BlockState = rawBlockStateToBlockState({
    id,
    name: block.block_state.name,
    block_number: block.block_state.block_number,
    sequence: block.block_state.sequence,
    accounts,
  });
  //console.log("blockState", blockState);
  return blockState;
}

export async function fetchBlockProofs(params: {
  blockNumber: number;
}): Promise<BlockProofs> {
  const dexID = await getDexID();
  if (!dexID) {
    throw new Error("DEX_ID is not set");
  }
  const { blockNumber } = params;
  //console.log("fetchBlockProofs", { blockNumber });
  const dex = await fetchDexObject();
  const dexData = (dex?.data?.content as any)?.fields?.proof_calculations.fields
    ?.id?.id;
  //console.log("dexData", dexData);
  if (!dexData || typeof dexData !== "string") {
    throw new Error("DEX_DATA is not received");
  }
  const statuses = await suiClient.getDynamicFieldObject({
    parentId: dexData,
    name: {
      type: "u64",
      value: blockNumber.toString(),
    },
  });

  const data = (statuses.data?.content as any)?.fields;

  const items = (
    statuses.data?.content as any
  )?.fields?.proofs?.fields?.contents.map((item: any) => {
    return {
      sequences: (item?.fields?.key as string[])?.map(Number),
      status: item?.fields?.value?.fields,
    };
  });

  return {
    blockNumber,
    blockProof: data.block_proof,
    startSequence: Number(data.start_sequence),
    endSequence: data.end_sequence ? Number(data.end_sequence) : undefined,
    isFinished: data.is_finished,
    proofs: items,
  };
}

export async function fetchDexEvents(params: {
  firstSequence: number;
  lastSequence?: number;
  limit?: number;
}): Promise<OperationEvent[] | undefined> {
  const { firstSequence, lastSequence, limit } = params;
  //console.log("fetchDexEvents", params);
  const packageID = await getPackageID();
  if (!packageID) {
    throw new Error("PACKAGE_ID is not set");
  }
  const events: OperationEvent[] = [];

  function convertEvents(events: SuiEvent[]): OperationEvent[] {
    return events
      ?.filter((event) => event?.type?.includes("::transactions::Operation"))
      .map((event) => {
        return {
          type: event.type?.split("::").at(-1),
          details: (event?.parsedJson as any)?.details,
          operation: (event?.parsedJson as any)?.operation,
          timestamp: Number(event?.timestampMs),
        } as RawOperationEvent;
      })
      .map(convertRawOperationEvent);
  }
  let eventsData = await suiClient.queryEvents({
    query: {
      MoveModule: {
        package: packageID,
        module: "transactions",
      },
    },
    limit,
    order: "descending",
  });
  if (eventsData) {
    events.push(...convertEvents(eventsData.data));
  }
  let fetchedAllEvents = events.some((event) => {
    return event.operation.sequence === firstSequence;
  });
  while (
    eventsData?.hasNextPage &&
    eventsData?.nextCursor &&
    !fetchedAllEvents
  ) {
    eventsData = await suiClient.queryEvents({
      query: {
        MoveModule: {
          package: packageID,
          module: "transactions",
        },
      },
      limit,
      order: "descending",
      cursor: eventsData?.nextCursor,
    });
    if (eventsData) {
      events.push(...convertEvents(eventsData.data));
    }
    fetchedAllEvents = events.some((event) => {
      return event.operation.sequence === firstSequence;
    });
  }
  // console.log(
  //   "fetchDexEvents events",
  //   events.map((event) => event.operation.sequence)
  // );
  const filteredEvents: OperationEvent[] = events.filter((event) => {
    if (event?.operation?.sequence < firstSequence) {
      return false;
    }
    if (lastSequence && event?.operation?.sequence > lastSequence) {
      return false;
    }
    return true;
  });
  return filteredEvents;
}

export async function fetchProofEvents(params: {
  limit?: number;
}): Promise<RollupEvent[] | undefined> {
  const { limit } = params;
  const packageID = await getPackageID();
  if (!packageID) {
    throw new Error("PACKAGE_ID is not set");
  }
  const events: RollupEvent[] = [];

  function convertEvents(events: SuiEvent[]): RollupEvent[] {
    return events
      ?.filter((event) => event?.type?.includes("::prover::"))
      .map((event) => {
        return {
          type: event.type?.split("::").at(-1),
          digest: event?.id.txDigest,
          data: event?.parsedJson as any,
          timestamp: Number(event?.timestampMs),
        } as RawEvent;
      })
      .map(convertRollupEvent);
  }
  let eventsData = await suiClient.queryEvents({
    query: {
      MoveModule: {
        package: packageID,
        module: "main",
      },
    },
    limit,
    order: "descending",
  });
  //console.log("eventsData", eventsData.data[0]);
  if (eventsData) {
    events.push(...convertEvents(eventsData.data));
  }
  return events;
}

export async function fetchSettlementTransactionEvents(params: {
  limit?: number;
}): Promise<MinaTransactionEvent[] | undefined> {
  const { limit } = params;
  console.log("fetchSettlementTransactionEvents", params);
  const packageID = await getPackageID();
  if (!packageID) {
    throw new Error("PACKAGE_ID is not set");
  }
  const events: RollupEvent[] = [];

  function convertEvents(events: SuiEvent[]): RollupEvent[] {
    return events
      ?.filter((event) => event?.type?.includes("::main::MinaTransactionEvent"))
      .map((event) => {
        return {
          type: event.type?.split("::").at(-1),
          digest: event?.id.txDigest,
          data: event?.parsedJson as any,
          timestamp: Number(event?.timestampMs),
        } as RawEvent;
      })
      .map(convertRollupEvent);
  }
  let eventsData = await suiClient.queryEvents({
    query: {
      MoveEventType: `${packageID}::main::MinaTransactionEvent`,
    },
    limit,
    order: "descending",
  });
  //console.log("eventsData", eventsData.data[0]);
  if (eventsData) {
    events.push(...convertEvents(eventsData.data));
  }

  const filteredEvents = events.filter(
    (event): event is MinaTransactionEvent =>
      event.type === "MinaTransactionEvent"
  );

  // Group by blockNumber and keep only the latest event by timestamp for each block
  const blockMap = new Map<bigint, MinaTransactionEvent>();
  for (const event of filteredEvents) {
    const blockNumber = event.block_number;
    if (
      !blockMap.has(blockNumber) ||
      blockMap.get(blockNumber)!.timestamp < event.timestamp
    ) {
      blockMap.set(blockNumber, event);
    }
  }

  // Convert map back to array and sort by blockNumber descending
  return Array.from(blockMap.values()).sort((a, b) =>
    b.block_number > a.block_number ? 1 : -1
  );
}

export async function fetchBlockSequences(params: {
  blockNumber: number;
}): Promise<{ startSequence: bigint; endSequence: bigint } | undefined> {
  const { blockNumber } = params;
  try {
    const dex = await fetchDex();
    if (!dex) return undefined;
    if (dex?.block_number === blockNumber)
      return {
        startSequence: dex.previous_block_last_sequence + 1n,
        endSequence: dex.sequence,
      };
    if (dex?.block_number < blockNumber) return undefined;

    const block = await fetchBlock({ blockNumber });
    if (!block) {
      return undefined;
    }
    return {
      startSequence: BigInt(block.block.start_sequence),
      endSequence: BigInt(block.block.end_sequence),
    };
  } catch (error: any) {
    console.error("Error in fetchBlockSequences", error?.message);
    return undefined;
  }
}
