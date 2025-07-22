import { Transaction } from "@mysten/sui/transactions";
import {
  getKey,
  executeTx,
  waitTx,
  saveToDA,
  ProofResultSubmission,
  fetchBlockProofs,
  fetchBlock,
  fetchDex,
  checkBlockCreation,
  agentMerge,
  agentSettle,
  agentMonitor,
  silvanaFaucetReturnKey,
  getSuiBalance,
  getSuiAddress,
} from "@dex-agent/lib";
import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui/utils";
import { SequenceState } from "./contracts/rollup.js";
import os from "node:os";
import { getIDs } from "./id.js";
import { sleep } from "@silvana-one/storage";
import { findProofsToMerge } from "./merge.js";
import { TOPUP_AMOUNT, MIN_SUI_BALANCE } from "./topup.js";

let proverSecretKey: string | undefined = undefined;
let adminSecretKey: string | undefined = process.env.ADMIN_SECRET_KEY;

export async function getProverSecretKey() {
  if (proverSecretKey) {
    return proverSecretKey;
  }
  const { secretKey } = await getKey({
    name: "prover",
    minBalance: MIN_SUI_BALANCE,
    topupAmount: TOPUP_AMOUNT,
  });
  proverSecretKey = secretKey;
  const address = await getSuiAddress({ secretKey });
  const balance = await getSuiBalance(address);
  console.log(`Prover address: ${address}, balance: ${balance} SUI`);
  return secretKey;
}

export async function clearProverSecretKey() {
  if (proverSecretKey) {
    const key = proverSecretKey;
    proverSecretKey = undefined;
    try {
      await silvanaFaucetReturnKey({ secretKey: key });
    } catch (error: any) {
      console.error("return key error", error?.message);
    }
  }
}

export async function startProving(params: {
  blockNumber: number;
  sequences: number[];
  mergedSequences1?: number[];
  mergedSequences2?: number[];
  jobId: string;
}): Promise<boolean> {
  const { blockNumber, sequences, mergedSequences1, mergedSequences2, jobId } =
    params;
  const { packageID, dexID } = await getIDs();
  if (!packageID || !dexID) {
    throw new Error("PACKAGE_ID or DEX_ID is not set");
  }
  const { address, keypair } = await getKey({
    secretKey: await getProverSecretKey(),
    name: "prover",
    minBalance: MIN_SUI_BALANCE,
    topupAmount: TOPUP_AMOUNT,
  });

  try {
    const tx = new Transaction();
    /*
public fun start_proving(
    dex: &mut DEX,
    block_number: u64,
    sequences: vector<u64>, // should be sorted
    merged_sequences_1: Option<vector<u64>>,
    merged_sequences_2: Option<vector<u64>>,
    job_id: String,
    clock: &Clock,
    ctx: &mut TxContext,
  */

    const proofArguments = [
      tx.object(dexID),
      tx.pure.u64(BigInt(blockNumber)),
      tx.pure.vector("u64", sequences.map(BigInt)),
      tx.pure.option(
        "vector<u64>",
        mergedSequences1 ? mergedSequences1.map(BigInt) : null
      ),
      tx.pure.option(
        "vector<u64>",
        mergedSequences2 ? mergedSequences2.map(BigInt) : null
      ),
      tx.pure.string(jobId),
      tx.object(SUI_CLOCK_OBJECT_ID),
    ];

    tx.moveCall({
      package: packageID,
      module: "main",
      function: "start_proving",
      arguments: proofArguments,
    });

    tx.setSender(address);
    tx.setGasBudget(100_000_000);
    //const signedTx = await tx.sign({ client: suiClient, signer: keypair });
    const executeResult = await executeTx({
      tx,
      keyPair: keypair,
      useParallelExecutor: true,
      showErrors: false,
    });
    if (!executeResult) return false;

    const { tx: txResponse, digest, events } = executeResult;
    //console.log("Events:", events);
    //console.log("Tx:", txResponse);

    // Wait for transaction to complete
    const waitResult = await waitTx(digest);
    // if (waitResult.errors) {
    //   console.log(`Errors for tx ${digest}:`, waitResult.errors);
    //   throw new Error(`Failed to submit proof: ${waitResult.errors}`);
    // }
    console.log("Proving started successfully:", digest);
    return true;
  } catch (error: any) {
    console.log("Proving not started, already running");
    return false;
  }
}

export async function submitProof(params: {
  state: SequenceState;
  mergedSequences1?: number[];
  mergedSequences2?: number[];
  jobId: string;
  cpuTime: number;
}): Promise<ProofResultSubmission | undefined> {
  const { state, mergedSequences1, mergedSequences2, jobId, cpuTime } = params;
  const { packageID, dexID } = await getIDs();
  if (!packageID || !dexID) {
    throw new Error("PACKAGE_ID or DEX_ID is not set");
  }

  const proof = state.dexProof?.toJSON();
  if (!proof) {
    throw new Error("Proof is not provided");
  }

  const { address, keypair, secretKey } = await getKey({
    secretKey: await getProverSecretKey(),
    name: "prover",
    minBalance: MIN_SUI_BALANCE,
    topupAmount: TOPUP_AMOUNT,
  });

  const blobData = state.toJSON();
  console.time("saveToDA");
  const blobId = await saveToDA({
    data: blobData,
    address,
    days: 10,
    filename: `dex-proof-${state.blockNumber}.json`,
    description: `proof for block ${state.blockNumber}, sequences: ${
      state.sequences[0]
    } - ${state.sequences[state.sequences.length - 1]}`,
  });
  console.timeEnd("saveToDA");
  console.log("Blob ID:", blobId);
  if (!blobId) {
    throw new Error("Blob ID is not received");
  }

  const info = {
    cpuCores: os.cpus().length,
    totalMemory: os.totalmem(),
    architecture: os.arch(),
  };

  const tx = new Transaction();
  /*
public fun submit_proof(
    dex: &mut DEX,
    block_number: u64,
    sequences: vector<u64>, // should be sorted
    merged_sequences_1: Option<vector<u64>>,
    merged_sequences_2: Option<vector<u64>>,
    job_id: String,
    da_hash: String,
    cpu_cores: u8,
    prover_architecture: String,
    prover_memory: u64,
    cpu_time: u64,
    clock: &Clock,
    ctx: &mut TxContext,
  */

  const proofArguments = [
    tx.object(dexID),
    tx.pure.u64(BigInt(state.blockNumber)),
    tx.pure.vector("u64", state.sequences.map(BigInt)),
    tx.pure.option(
      "vector<u64>",
      mergedSequences1 ? mergedSequences1.map(BigInt) : null
    ),
    tx.pure.option(
      "vector<u64>",
      mergedSequences2 ? mergedSequences2.map(BigInt) : null
    ),
    tx.pure.string(jobId),
    tx.pure.string(blobId),
    tx.pure.u8(info.cpuCores),
    tx.pure.string(info.architecture),
    tx.pure.u64(info.totalMemory),
    tx.pure.u64(cpuTime),
    tx.object(SUI_CLOCK_OBJECT_ID),
  ];

  tx.moveCall({
    package: packageID,
    module: "main",
    function: "submit_proof",
    arguments: proofArguments,
  });

  tx.setSender(address);
  tx.setGasBudget(200_000_000);
  //const signedTx = await tx.sign({ client: suiClient, signer: keypair });
  const executeResult = await executeTx({
    tx,
    keyPair: keypair,
    useParallelExecutor: true,
  });
  if (!executeResult) return undefined;
  const { digest } = executeResult;

  // Wait for transaction to complete
  const waitResult = await waitTx(digest);
  if (waitResult.errors) {
    console.log(`Errors for tx ${digest}:`, waitResult.errors);
    throw new Error(`Failed to submit proof: ${waitResult.errors}`);
  }
  console.log("Proof submitted successfully:", digest);
  await sleep(1000);
  const blockProofs = await fetchBlockProofs({
    blockNumber: state.blockNumber,
  });

  let callMerge = false;
  const mergeProofRequest = findProofsToMerge(blockProofs);
  if (mergeProofRequest) {
    callMerge = true;
  } else {
    const dex = await fetchDex();
    if (dex) {
      const lastProvedBlockNumber = Number(dex.last_proved_block_number);
      const lastBlockNumber = Number(dex.block_number);
      for (let i = lastProvedBlockNumber + 1; i <= lastBlockNumber; i++) {
        const blockProofs = await fetchBlockProofs({
          blockNumber: i,
        });
        const mergeProofRequest = findProofsToMerge(blockProofs);
        if (mergeProofRequest) {
          callMerge = true;
          break;
        }
      }
    }
  }
  if (callMerge) {
    await agentMerge();
  }
  const block = await fetchBlock({ blockNumber: state.blockNumber });
  if (
    block.block.end_sequence &&
    block.block.start_sequence === state.sequences[0] &&
    block.block.end_sequence === state.sequences[state.sequences.length - 1]
  ) {
    await agentSettle();
  }
  const blockResult = await checkBlockCreation({
    key: await getProverSecretKey(),
  });
  if (blockResult?.digest) {
    console.log("Waiting for block to be created:", {
      digest: blockResult.digest,
    });
    await waitTx(blockResult.digest);
  }

  const result: ProofResultSubmission = {
    type: state.sequences.length > 1 ? "merge proofs" : "calculate proof",
    blockNumber: state.blockNumber,
    sequences: state.sequences,
    mergedSequences1: mergedSequences1,
    mergedSequences2: mergedSequences2,
    dexID: dexID,
    digest: digest,
    da: blobId,
  };
  return result;
}

export async function rejectProof(params: {
  blockNumber: number;
  sequences: number[];
  da?: string;
}): Promise<ProofResultSubmission | undefined> {
  const { blockNumber, sequences, da } = params;
  const { packageID, dexID } = await getIDs();
  if (!packageID || !dexID) {
    throw new Error("PACKAGE_ID or DEX_ID is not set");
  }

  const { address, keypair } = await getKey({
    secretKey: await getProverSecretKey(),
    name: "prover",
    minBalance: MIN_SUI_BALANCE,
    topupAmount: TOPUP_AMOUNT,
  });

  const tx = new Transaction();
  /*
public fun reject_proof(
    dex: &mut DEX,
    block_number: u64,
    sequences: vector<u64>, // should be sorted
    clock: &Clock,
    ctx: &mut TxContext,
  */

  const proofArguments = [
    tx.object(dexID),
    tx.pure.u64(BigInt(blockNumber)),
    tx.pure.vector("u64", sequences.map(BigInt)),
    tx.object(SUI_CLOCK_OBJECT_ID),
  ];

  tx.moveCall({
    package: packageID,
    module: "main",
    function: "reject_proof",
    arguments: proofArguments,
  });

  tx.setSender(address);
  tx.setGasBudget(200_000_000);
  //const signedTx = await tx.sign({ client: suiClient, signer: keypair });
  const executeResult = await executeTx({
    tx,
    keyPair: keypair,
    useParallelExecutor: true,
  });
  if (!executeResult) return undefined;
  const { digest } = executeResult;

  // Wait for transaction to complete
  const waitResult = await waitTx(digest);
  if (waitResult.errors) {
    console.log(`Errors for tx ${digest}:`, waitResult.errors);
    throw new Error(`Failed to submit proof: ${waitResult.errors}`);
  }
  console.log("Proof rejection submitted successfully:", digest);
  const result: ProofResultSubmission = {
    type: "reject proof",
    blockNumber: blockNumber,
    sequences: sequences,
    dexID: dexID,
    digest: digest,
    da: da,
  };
  return result;
}

export async function submitMinaTx(params: {
  blockNumber: number;
  minaTx: string;
}): Promise<string | undefined> {
  console.log("Submitting mina tx hash to sui contract", params);
  const { blockNumber, minaTx } = params;
  const { packageID, dexID } = await getIDs();
  if (!packageID || !dexID) {
    throw new Error("PACKAGE_ID or DEX_ID is not set");
  }

  const { address, keypair } = await getKey({
    secretKey: adminSecretKey,
    name: "admin",
    minBalance: MIN_SUI_BALANCE,
    topupAmount: TOPUP_AMOUNT,
  });

  const tx = new Transaction();

  /*
      public fun update_block_mina_tx_hash(
          admin: &Admin,
          block: &mut Block,
          mina_tx_hash: String,
          clock: &Clock,
          ctx: &mut TxContext,
  */
  const proofArguments = [
    tx.object(dexID),
    tx.pure.u64(BigInt(blockNumber)),
    tx.pure.string(minaTx),
    tx.object(SUI_CLOCK_OBJECT_ID),
  ];

  tx.moveCall({
    package: packageID,
    module: "main",
    function: "update_block_mina_tx_hash",
    arguments: proofArguments,
  });

  tx.setSender(address);
  tx.setGasBudget(10_000_000);
  //const signedTx = await tx.sign({ client: suiClient, signer: keypair });
  const executeResult = await executeTx({
    tx,
    keyPair: keypair,
    useParallelExecutor: true,
  });
  if (!executeResult) return;
  const { digest } = executeResult;

  // Wait for transaction to complete
  const waitResult = await waitTx(digest);
  if (waitResult.errors) {
    console.log(`Errors for tx ${digest}:`, waitResult.errors);
    throw new Error(`Failed to submit mina tx: ${waitResult.errors}`);
  }
  console.log("Mina tx submitted successfully:", digest);
  await agentMonitor({ blockNumber });
  return digest;
}

export async function submitMinaTxInclusion(params: {
  blockNumber: number;
  timestamp: number;
}): Promise<void> {
  console.log("Submitting mina tx inclusion to sui contract", params);
  const { blockNumber, timestamp } = params;
  const { packageID, dexID } = await getIDs();
  if (!packageID || !dexID) {
    throw new Error("PACKAGE_ID or DEX_ID is not set");
  }

  const { address, keypair } = await getKey({
    secretKey: adminSecretKey,
    name: "admin",
    minBalance: MIN_SUI_BALANCE,
    topupAmount: TOPUP_AMOUNT,
  });

  const tx = new Transaction();

  /*
      public fun update_block_mina_tx_included_in_block(
          dex: &mut DEX,
          block_number: u64,
          settled_on_mina_at: u64,
          ctx: &mut TxContext,
  */
  const proofArguments = [
    tx.object(dexID),
    tx.pure.u64(BigInt(blockNumber)),
    tx.pure.u64(timestamp),
  ];

  tx.moveCall({
    package: packageID,
    module: "main",
    function: "update_block_mina_tx_included_in_block",
    arguments: proofArguments,
  });

  tx.setSender(address);
  tx.setGasBudget(10_000_000);
  //const signedTx = await tx.sign({ client: suiClient, signer: keypair });
  const executeResult = await executeTx({
    tx,
    keyPair: keypair,
    useParallelExecutor: true,
  });
  if (!executeResult) return;
  const { digest } = executeResult;

  // Wait for transaction to complete
  const waitResult = await waitTx(digest);
  if (waitResult.errors) {
    console.log(`Errors for tx ${digest}:`, waitResult.errors);
    throw new Error(`Failed to submit mina tx: ${waitResult.errors}`);
  }
  console.log("Mina tx inclusion submitted successfully:", digest);
}

export async function submitBlockProofDataAvailability(params: {
  blockNumber: number;
  blobId: string;
}): Promise<
  | {
      blockNumber: number;
      blobId: string;
      digest: string;
    }
  | undefined
> {
  try {
    console.log(
      "Submitting block proof data availability to sui contract",
      params
    );
    const { blockNumber, blobId } = params;
    const { packageID, dexID } = await getIDs();
    if (!packageID || !dexID) {
      throw new Error("PACKAGE_ID or DEX_ID is not set");
    }

    const { address, keypair } = await getKey({
      secretKey: adminSecretKey,
      name: "admin",
      minBalance: MIN_SUI_BALANCE,
      topupAmount: TOPUP_AMOUNT,
    });

    const tx = new Transaction();

    /*
    public fun update_block_proof_data_availability(
        dex: &mut DEX,
        block_number: u64,
        proof_data_availability: String,
        clock: &Clock,
        ctx: &mut TxContext,
  */
    const proofArguments = [
      tx.object(dexID),
      tx.pure.u64(BigInt(blockNumber)),
      tx.pure.string(blobId),
      tx.object(SUI_CLOCK_OBJECT_ID),
    ];

    tx.moveCall({
      package: packageID,
      module: "main",
      function: "update_block_proof_data_availability",
      arguments: proofArguments,
    });

    tx.setSender(address);
    tx.setGasBudget(200_000_000);
    //const signedTx = await tx.sign({ client: suiClient, signer: keypair });
    const executeResult = await executeTx({
      tx,
      keyPair: keypair,
      useParallelExecutor: true,
    });
    if (!executeResult) return undefined;
    const { digest } = executeResult;

    // Wait for transaction to complete
    const waitResult = await waitTx(digest);
    if (waitResult.errors) {
      console.log(`Errors for tx ${digest}:`, waitResult.errors);
      throw new Error(
        `Failed to submit block proof data availability: ${waitResult.errors}`
      );
    }
    console.log(
      "Block proof data availability submitted successfully:",
      digest
    );
    return {
      blockNumber,
      blobId,
      digest,
    };
  } catch (error: any) {
    console.error(
      "Error submitting block proof data availability:",
      error?.message
    );
    return undefined;
  }
}
