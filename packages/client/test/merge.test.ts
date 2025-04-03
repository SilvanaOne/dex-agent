import { describe, it } from "node:test";
import assert from "node:assert";
import {
  fetchEvents,
  fetchDexEvents,
  fetchDexObject,
  fetchDex,
  waitTx,
} from "@dex-agent/lib";
import { sleep } from "@silvana-one/storage";
import { EventId } from "@mysten/sui/client";
import { fetchProofStatus, fetchBlockProofs } from "@dex-agent/lib";
import {
  fetchSequenceData,
  submitProof,
  getProverSecretKey,
} from "@dex-agent/contracts";
import {
  ProofStatus,
  BlockProofs,
  ProofStatusData,
  MergeProofRequest,
  ProofStatusNames,
  checkBlockCreation,
} from "@dex-agent/lib";
import { Memory } from "@silvana-one/mina-utils";
import { mergeProofs } from "@dex-agent/contracts";
import { SequenceState, startProving, rejectProof } from "@dex-agent/contracts";
import { nanoid } from "nanoid";
import { Cache } from "o1js";
const proverId = "dex" + nanoid().replace(/[^A-Za-z0-9]/g, "");
let jobNumber = 1;
const TIMEOUT = 2 * 60 * 1000; // 2 minutes

describe("Merge proofs", async () => {
  it("should merge proofs", async () => {
    console.log("Prover ID:", proverId);
    await getProverSecretKey();
    let previous_last_proved_block_number = 0;
    let previous_current_block_number = 0;
    while (true) {
      const dex = await fetchDex();
      if (!dex) {
        throw new Error("DEX data not found");
      }
      const last_proved_block_number = Number(dex.last_proved_block_number);
      const current_block_number = Number(dex.block_number);
      if (
        previous_current_block_number !== current_block_number ||
        previous_last_proved_block_number !== last_proved_block_number
      ) {
        previous_last_proved_block_number = last_proved_block_number;
        previous_current_block_number = current_block_number;
        console.log(
          "\x1b[32m%s\x1b[0m",
          "last proved block number",
          last_proved_block_number
        );
        console.log(
          "\x1b[32m%s\x1b[0m",
          "current block number",
          current_block_number
        );
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
        // if (!mergeProofRequest) {
        //   console.log(
        //     "\x1b[31m%s\x1b[0m",
        //     `No proofs to merge for block ${blockNumber}`
        //   );
        //   console.log(proofs.proofs.map((p) => p.sequences));
        // }
        if (mergeProofRequest) {
          console.log("Merging proofs:", {
            blockNumber,
            proof1: mergeProofRequest.proof1.sequences,
            proof2: mergeProofRequest.proof2.sequences,
          });

          try {
            await proveSequenceInternal(mergeProofRequest);
            Memory.info(`Merged proofs for block ${blockNumber}`);
          } catch (error) {
            console.log(
              "\x1b[31m%s\x1b[0m",
              "Merge proofs operation aborted",
              error
            );
            Memory.info(`Merge proofs for block ${blockNumber} aborted`);
          }
          break;
        }
      }
      await sleep(5000);
    }
  });
});

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
async function proveSequenceInternal(mergeProofRequest: MergeProofRequest) {
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
    await rejectProof({
      blockNumber,
      sequences,
    });
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
    jobId: `${proverId}-${jobNumber++}`,
  });
  console.log("Reserved:", { reserved, blockNumber, sequences });
  if (reserved) {
    while (proverLock) {
      await sleep(50);
    }
    runProver(mergeProofRequest);
    const startTime = Date.now();
    const blockResult = await checkBlockCreation({
      key: await getProverSecretKey(),
    });
    if (blockResult?.digest) {
      console.log("Waiting for block to be created:", {
        digest: blockResult.digest,
      });
      await waitTx(blockResult.digest);
    }
    const passedTime = Date.now() - startTime;
    if (passedTime < 5000) {
      await sleep(5000 - passedTime);
    }
  }
}

async function runProver(mergeProofRequest: MergeProofRequest) {
  if (proverLock) {
    throw new Error("Prover is already running");
  }
  proverLock = true;
  const { blockNumber } = mergeProofRequest;
  const startTime = Date.now();
  const cache = Cache.FileSystem("./cache");
  const sequenceData = await mergeProofs({
    request: mergeProofRequest,
    cache,
  });
  if (sequenceData)
    submitProof({
      state: sequenceData,
      mergedSequences1: mergeProofRequest.proof1.sequences,
      mergedSequences2: mergeProofRequest.proof2.sequences,
      jobId: `${proverId}-${jobNumber++}`,
      cpuTime: Date.now() - startTime,
    });
  Memory.info(`Merged proofs for block ${blockNumber}`);
  proverLock = false;
}
