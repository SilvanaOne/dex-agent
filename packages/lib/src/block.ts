import { Block, RawBlock, BlockState, BlockStateRaw } from "./types.js";
import { u256ToPublicKey } from "./public-key.js";
import { UserTradingAccount } from "./types.js";
import { fetchDex } from "./fetch.js";
import { getConfig } from "./config.js";
import { Transaction } from "@mysten/sui/transactions";
import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui/utils";
import { getKey, getUserKey, returnUserKey } from "./key.js";
import { executeOperationTx } from "./operaton.js";
import { LastTransactionData, Operation } from "./types.js";
import { agentSettle } from "./agent.js";
import { waitTx } from "./execute.js";
const MIN_TIME_BETWEEN_BLOCKS = 30_000;

export async function blockCreationNeeded(): Promise<boolean> {
  try {
    const dex = await fetchDex();
    if (!dex) {
      console.log("DEX not found");
      return false;
    }
    if (Date.now() - dex.previous_block_timestamp < MIN_TIME_BETWEEN_BLOCKS) {
      return false;
    }
    if (dex.sequence === dex.previous_block_last_sequence + 1n) {
      return false;
    }
    return true;
  } catch (error: any) {
    console.error("Error checking block creation:", error.message);
    return false;
  }
}

export async function checkBlockCreation(params: {
  key?: string;
  verbose?: boolean;
}): Promise<Partial<LastTransactionData> | undefined> {
  try {
    const { verbose = false, key } = params;
    const dex = await fetchDex();
    if (!dex) {
      console.log("DEX not found");
      return undefined;
    }
    if (Date.now() - dex.previous_block_timestamp < MIN_TIME_BETWEEN_BLOCKS) {
      if (verbose) {
        console.log(
          "Not enough time has passed since the last block, skipping block creation"
        );
      }
      return undefined;
    }
    if (dex.sequence === dex.previous_block_last_sequence + 1n) {
      if (verbose) {
        console.log(
          "Block creation is not needed, no new transactions since last block"
        );
      }
      return undefined;
    }
    return await createBlock({ key, verbose });
  } catch (error: any) {
    console.error("Error checking block creation:", error.message);
    return undefined;
  }
}

export async function createBlock(params: {
  key?: string;
  verbose: boolean;
}): Promise<Partial<LastTransactionData> | undefined> {
  try {
    const { verbose } = params;
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

    const tx = new Transaction();

    const blockArguments = [tx.object(dexID), tx.object(SUI_CLOCK_OBJECT_ID)];

    tx.moveCall({
      package: packageID,
      module: "main",
      function: "create_block",
      arguments: blockArguments,
    });

    const key = params.key ?? (await keyPromise);
    const { address, keypair } = await getKey({
      secretKey: key,
      name: "user",
    });

    tx.setSender(address);
    tx.setGasBudget(200_000_000);

    const end = Date.now();
    const prepareTime = end - start;
    const result = await executeOperationTx({
      operation: Operation.CREATE_BLOCK,
      tx,
      keyPair: keypair,
      useParallelExecutor: false,
    });
    if (verbose) {
      console.log("Create block:", result);
    }
    if (!result || !result.digest) {
      return undefined;
    }

    await waitTx(result.digest);
    await agentSettle();

    return {
      ...result,
      prepareTime,
    };
  } catch (error: any) {
    console.error("Error creating block:", error.message);
    return undefined;
  }
}

export function rawBlockStateToBlockState(raw: BlockStateRaw): BlockState {
  const blockState: BlockState = {
    id: raw.id,
    name: raw.name,
    block_number: Number(raw.block_number),
    sequence: Number(raw.sequence),
    state: Object.fromEntries(
      raw.accounts.map((item: { address: string; account: any }) => {
        if (!item.address || typeof item.address !== "string") {
          throw new Error("block state key is not a string");
        }
        const key = item.address;
        const value = item.account.fields;
        const account: UserTradingAccount = {
          baseTokenBalance: {
            amount: BigInt(value.baseTokenBalance.fields.amount),
            stakedAmount: BigInt(value.baseTokenBalance.fields.stakedAmount),
            borrowedAmount: BigInt(
              value.baseTokenBalance.fields.borrowedAmount
            ),
          },
          quoteTokenBalance: {
            amount: BigInt(value.quoteTokenBalance.fields.amount),
            stakedAmount: BigInt(value.quoteTokenBalance.fields.stakedAmount),
            borrowedAmount: BigInt(
              value.quoteTokenBalance.fields.borrowedAmount
            ),
          },
          bid: {
            amount: BigInt(value.bid.fields.amount),
            price: BigInt(value.bid.fields.price),
            isSome: value.bid.fields.isSome,
          },
          ask: {
            amount: BigInt(value.ask.fields.amount),
            price: BigInt(value.ask.fields.price),
            isSome: value.ask.fields.isSome,
          },
          nonce: BigInt(value.nonce),
        };
        return [key, account];
      })
    ),
  };
  return blockState;
}

export function rawBlockToBlock(raw: RawBlock): Block {
  const block: Block = {
    name: raw.name,
    block_number: Number(raw.block_number),
    start_sequence: Number(raw.start_sequence),
    end_sequence: Number(raw.end_sequence),
    timestamp: Number(raw.timestamp),
    time_since_last_block: Number(raw.time_since_last_block),
    number_of_transactions: Number(raw.number_of_transactions),
    start_action_state: raw.start_action_state,
    end_action_state: raw.end_action_state,
    state_data_availability: raw.state_data_availability,
    proof_data_availability: raw.proof_data_availability,
    mina_tx_hash: raw.mina_tx_hash,
    mina_tx_included_in_block: raw.mina_tx_included_in_block,
    block_state: {
      id: raw.block_state.fields.state.fields.id.id,
      name: raw.block_state.fields.name,
      block_number: Number(raw.block_state.fields.block_number),
      sequence: Number(raw.block_state.fields.sequence),
      users: raw.block_state.fields.users.map((user: string) =>
        u256ToPublicKey(BigInt(user))
      ),
    },
  };
  return block;
}
