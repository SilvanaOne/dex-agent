import { verify, Cache } from "o1js";
import { DEXProgram, SequenceState } from "./contracts/rollup.js";
import {
  ProofStatus,
  MergeProofRequest,
  BlockProofs,
  ProofStatusNames,
  sleep,
  checkBlockCreation,
  waitTx,
  agentProve,
  agentMerge,
  agentSettle,
  getConfig,
  blockCreationNeeded,
  getDAMetadata,
} from "@dex-agent/lib";
import { compileDEXProgram } from "./compile.js";
import {
  readFromDA,
  fetchDex,
  fetchBlockProofs,
  ProofResultSubmission,
} from "@dex-agent/lib";
import {
  startProving,
  submitProof,
  getProverSecretKey,
  rejectProof,
} from "./proof.js";
import { Memory } from "@silvana-one/mina-utils";
import { TransactionMetadata } from "@silvana-one/prover";

let proofs: Promise<void>[] = [];
let proofs_submitted: Promise<ProofResultSubmission | undefined>[] = [];
let proofs_verified: ProofResultSubmission[] = [];
let proofs_rejected: ProofResultSubmission[] = [];
const TIMEOUT = 2 * 60 * 1000; // 2 minutes
let previous_last_proved_block_number = 0;
let previous_current_block_number = 0;

export async function merge(params: {
  jobId: string;
  endTime: number;
  cache: Cache;
}): Promise<{
  metadata: TransactionMetadata;
  count: number;
}> {
  const { jobId, endTime, cache } = params;
  proofs = [];
  proofs_submitted = [];
  proofs_verified = [];
  proofs_rejected = [];
  let nextJob: boolean = true;
  while (Date.now() < endTime && nextJob) {
    nextJob = await mergeIteration({ jobId, endTime, cache });
  }
  if (nextJob) await agentMerge();
  if (proofs.length > 0) {
    console.time("Awaiting merged proofs...");
    await Promise.all(proofs);
    console.timeEnd("Awaiting merged proofs...");
  }
  let submissionsResults: (ProofResultSubmission | undefined)[] = [];
  if (proofs_submitted.length > 0) {
    console.time("Awaiting submissions...");
    submissionsResults = await Promise.all(proofs_submitted);
    console.timeEnd("Awaiting submissions...");
    console.log("submissionsResults", submissionsResults);
  }
  const { chain, network } = await getDAMetadata();
  return {
    count: proofs_rejected.length + proofs_submitted.length + proofs.length,
    metadata: {
      custom: {
        task: "merge",
        proofs_verified: proofs_verified,
        proofs_rejected: proofs_rejected,
      },
      jobMetadata: {
        coordination_txs: [
          ...submissionsResults
            .filter((p) => p !== undefined && p.digest)
            .map((p) => ({
              chain: "sui" as "sui",
              network: process.env.SUI_CHAIN as
                | "devnet"
                | "mainnet"
                | "testnet",
              hash: p?.digest as string,
              custom: p,
              linkId: p?.digest,
            })),
          ...proofs_rejected
            .filter((p) => p !== undefined && p.digest)
            .map((p) => ({
              chain: "sui" as "sui",
              network: process.env.SUI_CHAIN as
                | "devnet"
                | "mainnet"
                | "testnet",
              hash: p?.digest as string,
              custom: p,
              linkId: p.digest,
            })),
        ],
        proofs: [
          ...submissionsResults
            .filter((p) => p !== undefined && p.da)
            .map((p) => ({
              storage: {
                chain,
                network,
                hash: p?.da as string,
              },
              custom: { ...p, status: "submitted" },
              linkId: p?.digest,
            })),
          ...proofs_rejected
            .filter((p) => p !== undefined && p.da)
            .map((p) => ({
              storage: {
                chain,
                network,
                hash: p?.da as string,
              },
              custom: { ...p, status: "rejected" },
              linkId: p?.digest,
            })),
          ...proofs_verified
            .filter((p) => p !== undefined && p.da)
            .map((p) => ({
              storage: {
                chain,
                network,
                hash: p?.da as string,
              },
              custom: { ...p, status: "verified" },
              linkId: p?.digest,
            })),
        ],
        proof_availability_txs: [
          ...proofs_verified
            .filter((p) => p !== undefined && p.da)
            .map((p) => ({
              chain,
              network,
              hash: p?.da as string,
              custom: { ...p, status: "submitted" },
              linkId: p?.digest,
            })),
        ],
      },
    },
  };
}

async function mergeIteration(params: {
  jobId: string;
  endTime: number;
  cache: Cache;
}): Promise<boolean> {
  const { jobId, endTime, cache } = params;
  let proved = false;
  const dex = await fetchDex();
  if (!dex) {
    throw new Error("DEX data not found");
  }
  if (await blockCreationNeeded()) {
    const blockResult = await checkBlockCreation({
      key: await getProverSecretKey(),
    });
    if (blockResult?.digest) {
      console.log("Waiting for block to be created:", {
        digest: blockResult.digest,
      });
      await waitTx(blockResult.digest);
    }
  }
  const last_proved_block_number = Number(dex.last_proved_block_number);
  const current_block_number = Number(dex.block_number);
  if (
    previous_current_block_number !== current_block_number ||
    previous_last_proved_block_number !== last_proved_block_number
  ) {
    previous_last_proved_block_number = last_proved_block_number;
    previous_current_block_number = current_block_number;
    console.log("last proved block number", last_proved_block_number);
    console.log("current block number", current_block_number);
  }
  let startBlockNumber = last_proved_block_number + 1 - 5;
  if (startBlockNumber < 1) {
    startBlockNumber = 1;
  }
  for (
    let blockNumber = startBlockNumber;
    blockNumber <= current_block_number;
    blockNumber++
  ) {
    //console.log("fetchBlockProofs", { blockNumber });
    const proofs = await fetchBlockProofs({ blockNumber: blockNumber });
    //console.log(`proofs for block ${blockNumber}`, proofs.proofs);
    const mergeProofRequest = proofs.isFinished
      ? undefined
      : findProofsToMerge(proofs);
    if (mergeProofRequest) {
      console.log("Merging proofs:", {
        blockNumber,
        proof1: mergeProofRequest.proof1.sequences,
        proof2: mergeProofRequest.proof2.sequences,
        blockProof: mergeProofRequest.blockProof,
      });

      try {
        await proveSequenceInternal({
          mergeProofRequest,
          jobId,
          cache,
        });
        Memory.info(`Merged proofs for block ${blockNumber}`);
        return true;
      } catch (error) {
        console.log("Merge proofs operation aborted", error);
        Memory.info(`Merge proofs for block ${blockNumber} aborted`);
      }
    }
  }
  return false;
}

export async function mergeProofs(params: {
  request: MergeProofRequest;
  cache: Cache;
}): Promise<SequenceState | undefined> {
  const { request, cache } = params;

  const { blockNumber, proof1, proof2 } = request;
  if (proof1.sequences.length === 0 || proof2.sequences.length === 0) {
    throw new Error("Proofs are empty");
  }
  if (
    proof1.sequences[proof1.sequences.length - 1] + 1 !==
    proof2.sequences[0]
  ) {
    throw new Error("Proofs are not consecutive");
  }
  if (
    (proof1.status.status !== ProofStatus.CALCULATED &&
      proof1.status.status !== ProofStatus.USED &&
      proof1.status.status !== ProofStatus.RESERVED) ||
    (proof2.status.status !== ProofStatus.CALCULATED &&
      proof2.status.status !== ProofStatus.USED &&
      proof2.status.status !== ProofStatus.RESERVED)
  ) {
    throw new Error("Proofs are not calculated");
  }
  if (!proof1.status.da_hash || !proof2.status.da_hash) {
    throw new Error("Proofs are not stored in DA");
  }
  const compilePromise = compileDEXProgram(cache);
  let dataLoaded = true;
  // console.log("Proof 1", {
  //   block: blockNumber,
  //   sequences: proof1.sequences,
  //   status: proof1.status,
  //   da: proof1.status.da_hash,
  // });
  // console.log("Proof 2", {
  //   block: blockNumber,
  //   sequences: proof2.sequences,
  //   status: proof2.status,
  //   da: proof2.status.da_hash,
  // });

  const proof1Data = await readFromDA({
    blobId: proof1.status.da_hash,
  });

  if (!proof1Data) {
    console.log("Proof 1 is not stored in DA, rejecting proof", {
      block: blockNumber,
      sequences: proof1.sequences,
      status: proof1.status,
      da: proof1.status.da_hash,
    });
    const rejectProofResult = await rejectProof({
      blockNumber,
      sequences: proof1.sequences,
      da: proof1.status.da_hash,
    });
    if (rejectProofResult) {
      proofs_rejected.push(rejectProofResult);
    }
    dataLoaded = false;
  }

  const proof2Data = await readFromDA({
    blobId: proof2.status.da_hash,
  });
  if (!proof2Data) {
    console.log("Proof 2 is not stored in DA, rejecting proof", {
      block: blockNumber,
      sequences: proof2.sequences,
      status: proof2.status,
      da: proof2.status.da_hash,
    });
    const rejectProofResult = await rejectProof({
      blockNumber,
      sequences: proof2.sequences,
      da: proof2.status.da_hash,
    });
    if (rejectProofResult) {
      proofs_rejected.push(rejectProofResult);
    }
    dataLoaded = false;
  }
  if (!dataLoaded) {
    return undefined;
  }
  if (!proof1Data || !proof2Data) {
    throw new Error("Proofs are not stored in DA");
  }

  const sequenceState1 = await SequenceState.fromJSON(proof1Data);
  //console.log("sequenceState1", sequenceState1);
  if (!sequenceState1.dexProof) {
    throw new Error("Proof 1 is not exist in DA");
  }
  if (sequenceState1.blockNumber !== blockNumber) {
    throw new Error("Proof 1 is not for the same block");
  }
  if (sequenceState1.sequences.length !== proof1.sequences.length) {
    throw new Error("Proof 1 sequences lengths are not the same");
  }
  if (
    sequenceState1.sequences.some(
      (sequence, index) => sequence !== proof1.sequences[index]
    )
  ) {
    throw new Error("Proof 1 sequences are not the same");
  }
  const sequenceState2 = await SequenceState.fromJSON(proof2Data);
  //console.log("sequenceState2", sequenceState2);
  if (!sequenceState2.dexProof) {
    throw new Error("Proof 2 is not exist in DA");
  }
  if (sequenceState2.blockNumber !== blockNumber) {
    throw new Error("Proof 2 is not for the same block");
  }
  if (sequenceState2.sequences.length !== proof2.sequences.length) {
    throw new Error("Proof 2 sequences lengths are not the same");
  }
  if (
    sequenceState2.sequences.some(
      (sequence, index) => sequence !== proof2.sequences[index]
    )
  ) {
    throw new Error("Proof 2 sequences are not the same");
  }
  const config = await getConfig();
  const dexID = config.dex_object;
  const vk = await compilePromise;
  console.time("verify proof 1");
  const valid1 = await verify(sequenceState1.dexProof, vk);
  console.timeEnd("verify proof 1");
  if (!valid1) {
    throw new Error("Proof 1 is not valid");
  }
  proofs_verified.push({
    blockNumber,
    sequences: proof1.sequences,
    type: "verify proof",
    dexID,
    da: proof1.status.da_hash,
  });
  console.time("verify proof 2");
  const valid2 = await verify(sequenceState2.dexProof, vk);
  console.timeEnd("verify proof 2");
  if (!valid2) {
    throw new Error("Proof 2 is not valid");
  }
  proofs_verified.push({
    blockNumber,
    sequences: proof2.sequences,
    type: "verify proof",
    dexID,
  });
  console.time("merge");
  const mergedProof = await DEXProgram.merge(
    sequenceState1.dexProof.publicInput,
    sequenceState1.dexProof,
    sequenceState2.dexProof
  );
  console.timeEnd("merge");
  const sequenceState: SequenceState = new SequenceState({
    ...sequenceState2,
    sequences: [...sequenceState1.sequences, ...sequenceState2.sequences],
    dexProof: mergedProof.proof,
  });
  return sequenceState;
}

function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val === b[index]);
}

export function findProofsToMerge(
  proofs: BlockProofs
): MergeProofRequest | undefined {
  if (proofs.isFinished) {
    return undefined;
  }
  // console.log("findProofsToMerge", {
  //   blockNumber: proofs.blockNumber,
  //   proofs: proofs.proofs
  //     .filter((p) => p.status.status === ProofStatus.CALCULATED)
  //     .map((p) => p.sequences),
  // });
  if (proofs.endSequence) {
    for (let i = proofs.startSequence + 1; i <= proofs.endSequence; i++) {
      const sequence1: number[] = [];
      const sequence2: number[] = [];
      for (let j = proofs.startSequence; j < i; j++) sequence1.push(j);
      for (let j = i; j <= proofs.endSequence; j++) sequence2.push(j);
      const proof1 = proofs.proofs.find((p) =>
        arraysEqual(p.sequences, sequence1)
      );
      const proof2 = proofs.proofs.find((p) =>
        arraysEqual(p.sequences, sequence2)
      );
      if (
        proof1 &&
        proof2 &&
        (proof1.status.status === ProofStatus.CALCULATED ||
          proof1.status.status === ProofStatus.USED) &&
        (proof2.status.status === ProofStatus.CALCULATED ||
          proof2.status.status === ProofStatus.USED)
      ) {
        console.log("Merging proofs to create block proof:", {
          blockNumber: proofs.blockNumber,
          proof1: proof1.sequences,
          proof2: proof2.sequences,
        });
        return {
          blockNumber: proofs.blockNumber,
          proof1: proof1,
          proof2: proof2,
          blockProof: true,
        };
      }
    }
  }
  for (let i = 0; i < proofs.proofs.length; i++) {
    const proof1 = proofs.proofs[i];
    if (
      !(
        proof1.status.status === ProofStatus.CALCULATED ||
        (proof1.status.status === ProofStatus.RESERVED &&
          proof1.status.timestamp < Date.now() - TIMEOUT)
      )
    ) {
      continue;
    }
    for (let j = 0; j < proofs.proofs.length; j++) {
      if (i === j) continue;

      const proof2 = proofs.proofs[j];
      if (
        !(
          proof2.status.status === ProofStatus.CALCULATED ||
          (proof2.status.status === ProofStatus.RESERVED &&
            proof2.status.timestamp < Date.now() - TIMEOUT)
        )
      ) {
        continue;
      }

      // Condition 1: last element of proof1.sequences is one less than the first element of proof2.sequences
      if (
        proof1.sequences.length > 0 &&
        proof2.sequences.length > 0 &&
        proof1.sequences[proof1.sequences.length - 1] + 1 ===
          proof2.sequences[0]
      ) {
        // Construct combined sequences
        const combined = [...proof1.sequences, ...proof2.sequences];

        // Condition 2: ensure no proof already has the same combined sequence
        const theSameProof = proofs.proofs.find((p) =>
          arraysEqual(p.sequences, combined)
        );

        const alreadyExists =
          theSameProof !== undefined &&
          (theSameProof.status.status === ProofStatus.CALCULATED ||
            theSameProof.status.status === ProofStatus.USED ||
            theSameProof.status.status === ProofStatus.RESERVED ||
            (theSameProof.status.status === ProofStatus.STARTED &&
              theSameProof.status.timestamp > Date.now() - TIMEOUT));
        if (!alreadyExists) {
          return {
            blockNumber: proofs.blockNumber,
            proof1,
            proof2,
            status: theSameProof?.status.status,
            blockProof: false,
          };
        }
      }
    }
  }
  return undefined;
}

let proverLock = false;
async function proveSequenceInternal({
  mergeProofRequest,
  jobId,
  cache,
}: {
  mergeProofRequest: MergeProofRequest;
  jobId: string;
  cache: Cache;
}) {
  const { proof1, proof2, blockNumber, status } = mergeProofRequest;
  const sequences = [...proof1.sequences, ...proof2.sequences];
  if (
    status === ProofStatus.CALCULATED ||
    status === ProofStatus.USED ||
    status === ProofStatus.RESERVED ||
    status === ProofStatus.STARTED
  ) {
    console.log("Rejecting proof:", {
      sequences,
      blockNumber,
    });
    const rejectProofResult = await rejectProof({
      blockNumber,
      sequences,
      da: proof1.status.da_hash,
    });
    if (rejectProofResult) {
      proofs_rejected.push(rejectProofResult);
    }
  }
  console.log("Calculating proof:", {
    sequences,
    blockNumber,
    status: status ? ProofStatusNames[status] : "NEW",
  });
  const reserved = await startProving({
    blockNumber,
    sequences,
    mergedSequences1: proof1.sequences,
    mergedSequences2: proof2.sequences,
    jobId,
  });
  console.log("Reserved:", { reserved, blockNumber, sequences });
  if (reserved) {
    while (proverLock) {
      await sleep(50);
    }
    proofs.push(runProver({ mergeProofRequest, jobId, cache }));
    const startTime = Date.now();
    let passedTime = Date.now() - startTime;
    while (passedTime < 30000 && proverLock) {
      const blockResult = await checkBlockCreation({
        key: await getProverSecretKey(),
      });
      if (blockResult?.digest) {
        console.log("Waiting for block to be created:", {
          digest: blockResult.digest,
        });
        await waitTx(blockResult.digest);
      }
      await sleep(5000);
      passedTime = Date.now() - startTime;
    }
  }
}

async function runProver({
  mergeProofRequest,
  jobId,
  cache,
}: {
  mergeProofRequest: MergeProofRequest;
  jobId: string;
  cache: Cache;
}) {
  if (proverLock) {
    throw new Error("Prover is already running");
  }
  proverLock = true;
  const { blockNumber } = mergeProofRequest;
  const startTime = Date.now();
  const sequenceData = await mergeProofs({
    request: mergeProofRequest,
    cache,
  });
  if (sequenceData) {
    const submission = submitProof({
      state: sequenceData,
      mergedSequences1: mergeProofRequest.proof1.sequences,
      mergedSequences2: mergeProofRequest.proof2.sequences,
      jobId,
      cpuTime: Date.now() - startTime,
    });
    proofs_submitted.push(submission);
    if (mergeProofRequest.blockProof) {
      await submission;
      await agentSettle();
    }
  }
  Memory.info(`Merged proofs for block ${blockNumber}`);
  proverLock = false;
}
