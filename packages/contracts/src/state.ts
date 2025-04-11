import { PublicKey, Cache, Poseidon } from "o1js";
import {
  DEXAccountProof,
  DEXAccountProofProgram,
  DEXProgram,
  DEXProof,
  SequenceState,
} from "./contracts/rollup.js";
import {
  Operation,
  ActionCreateAccount,
  ActionAsk,
  ActionBid,
  ActionTransfer,
  ActionTrade,
  Block,
  DEXState,
  OperationEvent,
  OperationNames,
  UserTradingAccount,
  BlockState,
} from "@dex-agent/lib";
import {
  RollupActionCreateAccount,
  RollupActionAsk,
  RollupActionBid,
  RollupActionTransfer,
  RollupActionTrade,
  DEXMap,
  RollupDEXState,
  RollupUserTradingAccount,
} from "./types/provable-types.js";
import {
  deserializeIndexedMerkleMap,
  IndexedMapSerialized,
} from "@silvana-one/storage";

import { compileDEXProgram, compileDEXAccountProofProgram } from "./compile.js";

export async function calculateStateRoot(params: {
  state: Record<string, UserTradingAccount>;
}): Promise<bigint> {
  const { state } = params;
  const map = new DEXMap();
  for (const [key, value] of Object.entries(state)) {
    const mapKey = Poseidon.hashPacked(PublicKey, PublicKey.fromBase58(key));
    const mapValue = RollupUserTradingAccount.fromAccountData(value).hash();
    map.set(mapKey, mapValue);
  }
  return map.root.toBigInt();
}

export async function calculateState(params: {
  poolPublicKey: string;
  blockNumber: number;
  sequence: number;
  serializedMap: IndexedMapSerialized;
  block: Block;
  blockState: BlockState;
  operations: OperationEvent[];
  prove?: boolean;
  cache: Cache;
}): Promise<SequenceState> {
  const {
    blockNumber,
    block,
    blockState,
    sequence,
    operations,
    serializedMap,
    poolPublicKey,
    prove = false,
    cache,
  } = params;
  const events = operations.sort(
    (a, b) => a.operation.sequence - b.operation.sequence
  );
  let shouldCompile = false;
  const startSequence = block.start_sequence;
  if (prove) {
    if (sequence < startSequence) {
      throw new Error("Incorrect sequence, lower than start sequence");
    }
    if (!events.find((e) => e.operation.sequence === sequence)) {
      console.log("Prove sequence not found in events", {
        sequence,
        events: events.map((e) => e.operation.sequence),
      });
      throw new Error("Prove sequence not found in events");
    }
    shouldCompile = true;
  }
  let map = deserializeIndexedMerkleMap({
    serializedIndexedMap: serializedMap,
    type: DEXMap,
  });
  if (!map) {
    throw new Error("Map is not deserialized");
  }
  const dexState: DEXState = {
    poolPublicKey,
    root: map.root.toBigInt(),
    length: map.length.toBigInt(),
    actionState: 0n,
    sequence: BigInt(block.end_sequence),
    blockNumber: BigInt(blockNumber),
  };
  let rollupDexState = RollupDEXState.fromRollupData(dexState);
  const accounts: Record<string, RollupUserTradingAccount> = {};
  const reconcilationMap = new DEXMap();
  // Iterate through records in block.block_state.state
  if (!blockState || !blockState.state) {
    throw new Error("No block state records found");
  }
  //console.log("Reconciling block state");
  const stateRecords = blockState.state;

  for (const [key, value] of Object.entries(stateRecords)) {
    //console.log(`Processing account ${key}`);
    const mapKey = Poseidon.hashPacked(PublicKey, PublicKey.fromBase58(key));
    const account = RollupUserTradingAccount.fromAccountData(value);
    const mapValue = account.hash();
    reconcilationMap.set(mapKey, mapValue);
    accounts[key] = account;
  }
  if (reconcilationMap.length.toBigInt() !== map.length.toBigInt()) {
    console.log("Map length", map.length.toBigInt());
    console.log(
      "Reconciliation map length",
      reconcilationMap.length.toBigInt()
    );
    throw new Error("Reconciliation map length does not match");
  }
  if (reconcilationMap.root.toBigInt() !== map.root.toBigInt()) {
    console.log("Map root", map.root.toBigInt());
    console.log("Reconciliation map root", reconcilationMap.root.toBigInt());
    throw new Error("Reconciliation map root does not match");
  }
  let dexProof: DEXProof | undefined = undefined;

  const start = Date.now();

  for (const event of events) {
    const operation = event.operation;
    const currentSequence = operation.sequence;
    if (currentSequence > sequence) {
      throw new Error("Current sequence is greater than sequence");
    }

    const shouldProve = prove && currentSequence === sequence && shouldCompile;
    if (shouldProve) {
      console.log("Proving event", {
        sequence: currentSequence,
        operation: operation.operation,
        name: OperationNames[operation.operation],
      });
    }
    if (shouldProve) {
      await compileDEXProgram(cache);
    }
    const {
      dexState: newDexState,
      map: newMap,
      dexProof: newDexProof,
    } = await processOperation({
      event,
      dexState: rollupDexState,
      map,
      accounts,
      prove: shouldProve,
    });
    rollupDexState = newDexState;
    map = newMap;
    if (newDexProof) {
      dexProof = newDexProof;
    }
  }
  const end = Date.now();
  if (!prove) {
    console.log("Time taken for state calculation", end - start);
    console.log("Time taken per operation", (end - start) / events.length);
  }

  return new SequenceState({
    poolPublicKey,
    blockNumber,
    sequences: [sequence],
    dexState: rollupDexState,
    map,
    accounts,
    dexProof,
  });
}

export async function processOperation(params: {
  event: OperationEvent;
  dexState: RollupDEXState;
  map: DEXMap;
  accounts: Record<string, RollupUserTradingAccount>;
  prove?: boolean;
}): Promise<{
  dexState: RollupDEXState;
  map: DEXMap;
  dexProof?: DEXProof;
}> {
  const { event, dexState, map, accounts, prove = false } = params;
  const operation = event.operation.operation;
  const action = event.details;
  let newMap: DEXMap | undefined = undefined;
  let newDexState: RollupDEXState | undefined = undefined;
  let dexProof: DEXProof | undefined = undefined;
  if (prove) console.time("prove");
  switch (operation) {
    case Operation.CREATE_ACCOUNT:
      {
        const rollupAction = RollupActionCreateAccount.fromAction(
          action as ActionCreateAccount
        );
        if (prove) {
          console.time("createAccount");
          const { proof, auxiliaryOutput } = await DEXProgram.createAccount(
            dexState,
            map,
            rollupAction
          );
          dexProof = proof;
          newMap = auxiliaryOutput.map;
          accounts[rollupAction.publicKey.toBase58()] = auxiliaryOutput.account;
          newDexState = proof.publicOutput;
          console.timeEnd("createAccount");
        } else {
          const { publicOutput, auxiliaryOutput } =
            await DEXProgram.rawMethods.createAccount(
              dexState,
              map,
              rollupAction
            );
          newMap = auxiliaryOutput.map;
          accounts[rollupAction.publicKey.toBase58()] = auxiliaryOutput.account;
          newDexState = publicOutput;
        }
      }
      break;

    case Operation.ASK:
      {
        const rollupAction = RollupActionAsk.fromAction(action as ActionAsk);
        const account = accounts[rollupAction.userPublicKey.toBase58()];
        if (prove) {
          console.time("ask");
          const { proof, auxiliaryOutput } = await DEXProgram.ask(
            dexState,
            map,
            rollupAction,
            account
          );
          dexProof = proof;
          newMap = auxiliaryOutput.map;
          newDexState = proof.publicOutput;
          accounts[rollupAction.userPublicKey.toBase58()] =
            auxiliaryOutput.account;
          console.timeEnd("ask");
        } else {
          const { publicOutput, auxiliaryOutput } =
            await DEXProgram.rawMethods.ask(
              dexState,
              map,
              rollupAction,
              account
            );
          newMap = auxiliaryOutput.map;
          newDexState = publicOutput;
          accounts[rollupAction.userPublicKey.toBase58()] =
            auxiliaryOutput.account;
        }
      }
      break;

    case Operation.BID:
      {
        const rollupAction = RollupActionBid.fromAction(action as ActionBid);
        const account = accounts[rollupAction.userPublicKey.toBase58()];
        if (prove) {
          console.time("bid");
          const { proof, auxiliaryOutput } = await DEXProgram.bid(
            dexState,
            map,
            rollupAction,
            account
          );
          dexProof = proof;
          newMap = auxiliaryOutput.map;
          newDexState = proof.publicOutput;
          accounts[rollupAction.userPublicKey.toBase58()] =
            auxiliaryOutput.account;
          console.timeEnd("bid");
        } else {
          const { publicOutput, auxiliaryOutput } =
            await DEXProgram.rawMethods.bid(
              dexState,
              map,
              rollupAction,
              account
            );
          newMap = auxiliaryOutput.map;
          newDexState = publicOutput;
          accounts[rollupAction.userPublicKey.toBase58()] =
            auxiliaryOutput.account;
        }
      }
      break;
    case Operation.TRADE:
      {
        const rollupAction = RollupActionTrade.fromAction(
          action as ActionTrade
        );
        const buyerAccount = accounts[rollupAction.buyerPublicKey.toBase58()];
        const sellerAccount = accounts[rollupAction.sellerPublicKey.toBase58()];
        if (prove) {
          console.time("trade");
          const { proof, auxiliaryOutput } = await DEXProgram.trade(
            dexState,
            map,
            rollupAction,
            buyerAccount,
            sellerAccount
          );
          dexProof = proof;
          newMap = auxiliaryOutput.map;
          newDexState = proof.publicOutput;
          accounts[rollupAction.buyerPublicKey.toBase58()] =
            auxiliaryOutput.buyer;
          accounts[rollupAction.sellerPublicKey.toBase58()] =
            auxiliaryOutput.seller;
          console.timeEnd("trade");
        } else {
          const { publicOutput, auxiliaryOutput } =
            await DEXProgram.rawMethods.trade(
              dexState,
              map,
              rollupAction,
              buyerAccount,
              sellerAccount
            );
          newMap = auxiliaryOutput.map;
          newDexState = publicOutput;
          accounts[rollupAction.buyerPublicKey.toBase58()] =
            auxiliaryOutput.buyer;
          accounts[rollupAction.sellerPublicKey.toBase58()] =
            auxiliaryOutput.seller;
        }
      }
      break;
    case Operation.TRANSFER:
      {
        const rollupAction = RollupActionTransfer.fromAction(
          action as ActionTransfer
        );
        const senderAccount = accounts[rollupAction.senderPublicKey.toBase58()];
        const receiverAccount =
          accounts[rollupAction.receiverPublicKey.toBase58()];
        if (prove) {
          console.time("transfer");
          const { proof, auxiliaryOutput } = await DEXProgram.transfer(
            dexState,
            map,
            rollupAction,
            senderAccount,
            receiverAccount
          );
          dexProof = proof;
          newMap = auxiliaryOutput.map;
          newDexState = proof.publicOutput;
          accounts[rollupAction.senderPublicKey.toBase58()] =
            auxiliaryOutput.sender;
          accounts[rollupAction.receiverPublicKey.toBase58()] =
            auxiliaryOutput.receiver;
          console.timeEnd("transfer");
        } else {
          const { publicOutput, auxiliaryOutput } =
            await DEXProgram.rawMethods.transfer(
              dexState,
              map,
              rollupAction,
              senderAccount,
              receiverAccount
            );
          newMap = auxiliaryOutput.map;
          newDexState = publicOutput;
          accounts[rollupAction.senderPublicKey.toBase58()] =
            auxiliaryOutput.sender;
          accounts[rollupAction.receiverPublicKey.toBase58()] =
            auxiliaryOutput.receiver;
        }
      }
      break;

    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
  if (prove) console.timeEnd("prove");
  return {
    dexState: newDexState,
    map: newMap,
    dexProof: dexProof,
  };
}

export async function createAccountProof(params: {
  address: PublicKey;
  dexState: RollupDEXState;
  map: DEXMap;
  account: RollupUserTradingAccount;
  prove?: boolean;
  cache: Cache;
}): Promise<{
  dexAccountProof?: DEXAccountProof;
  proofPublicOutput?: RollupUserTradingAccount;
}> {
  const { dexState, map, address, account, prove = false, cache } = params;
  let dexAccountProof: DEXAccountProof | undefined = undefined;
  let proofPublicOutput: RollupUserTradingAccount;
  if (prove) console.time("prove");
  if (prove) {
    await compileDEXAccountProofProgram(cache);
  }

  if (prove) {
    const { proof } = await DEXAccountProofProgram.proveState(
      dexState,
      map,
      address,
      account
    );
    dexAccountProof = proof;
    proofPublicOutput = proof.publicOutput;
  } else {
    const { publicOutput } = await DEXAccountProofProgram.rawMethods.proveState(
      dexState,
      map,
      address,
      account
    );
    proofPublicOutput = publicOutput;
  }
  if (prove) console.timeEnd("prove");
  return {
    dexAccountProof: dexAccountProof,
    proofPublicOutput,
  };
}
