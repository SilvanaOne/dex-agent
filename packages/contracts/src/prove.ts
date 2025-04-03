import {
  agentProve,
  OperationNames,
  ProofResultSubmission,
  checkBlockCreation,
  getOrderbook,
  waitTx,
  blockCreationNeeded,
} from "@dex-agent/lib";
import { deserializeIndexedMerkleMap } from "@silvana-one/storage";
import { DEXMap, SequenceData } from "./types/provable-types.js";
import { sleep } from "@silvana-one/storage";
import {
  fetchProofStatus,
  fetchDex,
  fetchBlockProofs,
  findDeal,
  settleDeal,
} from "@dex-agent/lib";
import {
  startProving,
  submitProof,
  getProverSecretKey,
  rejectProof,
} from "./proof.js";
import { fetchSequenceData } from "./fetch.js";
import { ProofStatus, ProofStatusNames } from "@dex-agent/lib";
import { Memory } from "@silvana-one/mina-utils";
import { Cache } from "o1js";
const TIMEOUT = 2 * 60 * 1000; // 2 minutes
let last_proved_block_number = 0;
let last_proved_sequence = 0;

let proofs: Promise<void>[] = [];
let proofs_submitted: Promise<ProofResultSubmission | undefined>[] = [];
let proofs_rejected: ProofResultSubmission[] = [];

export async function prove(params: {
  jobId: string;
  endTime: number;
  cache: Cache;
}): Promise<{
  proofs_submitted: ProofResultSubmission[];
  proofs_rejected: ProofResultSubmission[];
}> {
  const { jobId, endTime, cache } = params;
  proofs = [];
  proofs_submitted = [];
  proofs_rejected = [];
  let nextJob: boolean = true;
  while (Date.now() < endTime) {
    nextJob = await proveIteration({ jobId, endTime, cache });
    if (!nextJob || Date.now() > endTime) {
      if (nextJob) await agentProve();
      console.log("Awaiting proofs...");
      console.time("Awaiting proofs...");
      await Promise.all(proofs);
      console.timeEnd("Awaiting proofs...");
      console.log("Awaiting submissions...");
      console.time("Awaiting submissions...");
      const submissionsResults = await Promise.all(proofs_submitted);
      console.timeEnd("Awaiting submissions...");
      console.log("submissionsResults", submissionsResults);
      return {
        proofs_submitted: submissionsResults.filter(
          (p) => p !== undefined
        ) as ProofResultSubmission[],
        proofs_rejected,
      };
    }
  }
  await agentProve();
  return {
    proofs_submitted: (await Promise.all(proofs_submitted)).filter(
      (p) => p !== undefined
    ) as ProofResultSubmission[],
    proofs_rejected,
  };
}

async function proveIteration(params: {
  jobId: string;
  endTime: number;
  cache: Cache;
}): Promise<boolean> {
  const { jobId, endTime, cache } = params;
  let proved = false;

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
  const dex = await fetchDex();
  if (!dex) {
    throw new Error("DEX data not found");
  }
  const new_last_proved_block_number = Number(dex.last_proved_block_number);
  const new_last_proved_sequence = Number(dex.last_proved_sequence);
  const current_block_number = Number(dex.block_number);
  const current_sequence = Number(dex.sequence);
  if (
    new_last_proved_block_number !== last_proved_block_number ||
    new_last_proved_sequence !== last_proved_sequence
  ) {
    last_proved_block_number = new_last_proved_block_number;
    last_proved_sequence = new_last_proved_sequence;
    console.log("last_proved_block_number", last_proved_block_number);
    console.log("last_proved_sequence", last_proved_sequence);
  }

  let startBlockNumber = last_proved_block_number + 1;
  if (startBlockNumber < 1) {
    startBlockNumber = 1;
  }
  for (
    let blockNumber = startBlockNumber;
    blockNumber <= current_block_number;
    blockNumber++
  ) {
    console.log(`Fetching block ${blockNumber} proofs...`);
    const blockProofs = await fetchBlockProofs({
      blockNumber,
    });
    console.log("blockProofs", {
      blockNumber,
      blockLength: blockProofs.proofs.length,
      isFinished: blockProofs.isFinished,
      startSequence: blockProofs.startSequence,
      endSequence: blockProofs.endSequence,
    });
    if (!blockProofs.isFinished) {
      let startSequence = blockProofs.startSequence;
      const maxSequence = blockProofs.endSequence ?? current_sequence;

      for (let sequence = startSequence; sequence <= maxSequence; sequence++) {
        if (sequence < current_sequence && Date.now() < endTime) {
          //console.log(`Proving sequence ${sequence}...`);
          proved =
            proved ||
            (await proveSequenceInternal({
              sequence,
              blockNumber,
              jobId,
              cache,
              endTime,
            }));
        }
      }
    }
  }
  return proved;
}

let proverLock = false;

async function proveSequenceInternal({
  sequence,
  blockNumber,
  jobId,
  cache,
  endTime,
}: {
  sequence: number;
  blockNumber: number;
  jobId: string;
  cache: Cache;
  endTime: number;
}): Promise<boolean> {
  const proof = await fetchProofStatus({
    sequence,
    blockNumber,
  });
  if (
    proof?.status !== ProofStatus.CALCULATED &&
    proof?.status !== ProofStatus.USED &&
    proof?.status !== ProofStatus.RESERVED
  ) {
    if (proof?.status === ProofStatus.STARTED) {
      const timeAgo = Date.now() - proof.timestamp;
      if (timeAgo < TIMEOUT) {
        console.log("Proof already started:", {
          sequence,
          blockNumber,
          timeAgoSeconds: timeAgo / 1000,
        });
        return false;
      }
      const rejectProofResult = await rejectProof({
        blockNumber,
        sequences: [sequence],
      });
      if (rejectProofResult) {
        proofs_rejected.push(rejectProofResult);
      }
      return true;
    }
    console.log("Calculating proof:", {
      sequence,
      blockNumber,
      status: proof?.status ? ProofStatusNames[proof?.status] : "NEW",
    });
    const reserved = await startProving({
      blockNumber,
      sequences: [sequence],
      jobId,
    });
    console.log("Reserved:", { reserved, blockNumber, sequence });
    if (reserved) {
      while (proverLock) {
        await sleep(100);
      }
      proofs.push(runProver({ sequence, blockNumber, jobId, cache }));
      let dex = await fetchDex();
      let orderbook = dex ? getOrderbook(dex) : undefined;
      let deal = dex && orderbook ? findDeal({ dex, orderbook }) : undefined;
      while (Date.now() < endTime && deal) {
        await settleDeal({
          deal,
          key: await getProverSecretKey(),
          verbose: true,
          useParallelExecutor: true,
        });
        dex = await fetchDex();
        orderbook = dex ? getOrderbook(dex) : undefined;
        deal =
          proverLock && dex && orderbook
            ? findDeal({ dex, orderbook })
            : undefined;
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
      while (Date.now() < endTime && proverLock) {
        await sleep(1000);
      }
      return true;
    }
  }
  return false;
}

async function runProver(params: {
  sequence: number;
  blockNumber: number;
  jobId: string;
  cache: Cache;
}) {
  if (proverLock) {
    throw new Error("Prover is already running");
  }
  proverLock = true;
  const { sequence, blockNumber, jobId, cache } = params;
  const startTime = Date.now();
  const sequenceData = await fetchSequenceData({
    sequence,
    blockNumber,
    prove: true,
    cache,
  });
  if (sequenceData) {
    const cpuTime = Date.now() - startTime;
    const submission = submitProof({
      state: sequenceData,
      jobId,
      cpuTime,
    });
    proofs_submitted.push(submission);
    Memory.info(`Proof for sequence ${sequence} submitted`);
  } else {
    console.error("Sequence data not found:", {
      sequence,
      blockNumber,
    });
  }
  proverLock = false;
}

export async function proveSequence(params: { sequenceData: SequenceData }) {
  const { sequenceData } = params;
  const {
    blockNumber,
    sequence,
    operation,
    map: serializedIndexedMap,
  } = sequenceData;
  console.log("proveSequence", {
    blockNumber,
    sequence,
    operation: OperationNames[operation.operation],
  });
  const map = deserializeIndexedMerkleMap({
    serializedIndexedMap,
    type: DEXMap,
  });
  console.log("map root", map?.root.toBigInt());
  console.log("map length", map?.length.toBigInt());
}
