import { describe, it } from "node:test";
import assert from "node:assert";
import {
  checkBlockCreation,
  fetchEvents,
  getOrderbook,
  waitTx,
} from "@dex-agent/lib";
import { sleep } from "@silvana-one/storage";
import { EventId } from "@mysten/sui/client";
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
  fetchSequenceData,
  rejectProof,
} from "@dex-agent/contracts";
import { Cache } from "o1js";
import { ProofStatus, ProofStatusNames } from "@dex-agent/lib";
import { Memory } from "@silvana-one/mina-utils";
import { nanoid } from "nanoid";

const packageID = process.env.PACKAGE_ID;
const proverId = "dex" + nanoid().replace(/[^A-Za-z0-9]/g, "");
let jobNumber = 1;
const TIMEOUT = 2 * 60 * 1000; // 2 minutes

describe("Prove", async () => {
  it("should prove", async () => {
    if (!packageID) {
      throw new Error("PACKAGE_ID is not set");
    }
    console.log("Prover ID:", proverId);
    await getProverSecretKey();

    let cursor: EventId | null | undefined = undefined;
    let lastTimestamp: number | undefined = undefined;
    let i = 1;
    let last_proved_block_number = 0;
    let last_proved_sequence = 0;
    let delay = 10;
    while (true) {
      await sleep(delay);
      const events = await fetchEvents({
        packageID,
        module: "transactions",
        cursor,
      });
      cursor = events?.nextCursor;
      if (events?.data) {
        const newEvents = events.data.map((event) => {
          return {
            type: event.type?.split("::").at(-1),
            timestamp: Number(event.timestampMs),
            data: event.parsedJson,
          };
        });
        // console.log(
        //   `*******************  events ${i}: ***********************\n`,
        //   // newEvents.map((event) => JSON.stringify(event, null, 2))
        //   newEvents
        // );
        const timestamp = events?.data?.[events.data.length - 1]?.timestampMs;
        if (timestamp && typeof timestamp === "string") {
          lastTimestamp = Number(timestamp);
        }
        if (newEvents.length === 0) {
          const dex = await fetchDex();
          if (!dex) {
            throw new Error("DEX data not found");
          }
          const new_last_proved_block_number = Number(
            dex.last_proved_block_number
          );

          const new_last_proved_sequence = Number(dex.last_proved_sequence);
          const current_block_number = Number(dex.block_number);
          const current_sequence = Number(dex.sequence);
          if (
            new_last_proved_block_number !== last_proved_block_number ||
            new_last_proved_sequence !== last_proved_sequence
          ) {
            last_proved_block_number = new_last_proved_block_number;
            last_proved_sequence = new_last_proved_sequence;
            console.log(
              "\x1b[32m%s\x1b[0m",
              "last_proved_block_number",
              last_proved_block_number
            );
            console.log(
              "\x1b[32m%s\x1b[0m",
              "last_proved_sequence",
              last_proved_sequence
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
            //console.log(`Fetching block ${blockNumber} proofs...`);
            const blockProofs = await fetchBlockProofs({
              blockNumber,
            });
            if (!blockProofs.isFinished) {
              let startSequence = blockProofs.startSequence;
              const maxSequence =
                blockProofs.endSequence ??
                blockProofs.proofs.reduce((max, proof) => {
                  return Math.max(
                    max,
                    proof.sequences.reduce((max, sequence) => {
                      return Math.max(max, sequence);
                    }, startSequence)
                  );
                }, startSequence);
              for (
                let sequence = startSequence;
                sequence <= maxSequence;
                sequence++
              ) {
                if (sequence < current_sequence) {
                  //console.log(`Proving sequence ${sequence}...`);
                  await proveSequenceInternal({ sequence, blockNumber });
                }
              }
            }
          }
          await sleep(1000);
        } else {
          for (const event of newEvents) {
            if ((event as any)?.data?.operation) {
              const sequence = Number(
                (event as any)?.data?.operation?.sequence
              );
              const blockNumber = Number(
                (event as any)?.data?.operation?.block_number
              );
              await proveSequenceInternal({ sequence, blockNumber });
            }
          }
        }
        i++;
      }
    }
  });
});

let proverLock = false;

async function proveSequenceInternal({
  sequence,
  blockNumber,
}: {
  sequence: number;
  blockNumber: number;
}) {
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
        return;
      }
      console.log("Rejecting proof:", {
        sequence,
        blockNumber,
        timeAgoSeconds: timeAgo / 1000,
      });
      await rejectProof({
        blockNumber,
        sequences: [sequence],
      });
    }
    console.log("Calculating proof:", {
      sequence,
      blockNumber,
      status: proof?.status ? ProofStatusNames[proof?.status] : "NEW",
    });
    const reserved = await startProving({
      blockNumber,
      sequences: [sequence],
      jobId: `${proverId}-${jobNumber++}`,
    });
    console.log("Reserved:", { reserved, blockNumber, sequence });
    if (reserved) {
      while (proverLock) {
        await sleep(50);
      }
      runProver({ sequence, blockNumber });
      const startTime = Date.now();
      const TIMEOUT = 10000;
      let dex = await fetchDex();
      let orderbook = dex ? getOrderbook(dex) : undefined;
      let deal = dex && orderbook ? findDeal({ dex, orderbook }) : undefined;
      while (Date.now() - startTime < TIMEOUT && deal) {
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
      const passedTime = Date.now() - startTime;
      if (passedTime < 5000) {
        await sleep(5000 - passedTime);
      }
    }
  } else {
    // process.stdout.write(
    //   `${blockNumber}:${sequence}                                     \r`
    // );
    //console.log(`${blockNumber}:${sequence}`);
  }
}

async function runProver(params: { sequence: number; blockNumber: number }) {
  if (proverLock) {
    throw new Error("Prover is already running");
  }
  proverLock = true;
  const { sequence, blockNumber } = params;
  const startTime = Date.now();
  const cache = Cache.FileSystem("./cache");
  const sequenceData = await fetchSequenceData({
    sequence,
    blockNumber,
    prove: true,
    cache,
  });
  if (sequenceData) {
    const cpuTime = Date.now() - startTime;
    submitProof({
      state: sequenceData,
      jobId: `${proverId}-${jobNumber}`,
      cpuTime,
    });
    Memory.info(`Proof for sequence ${sequence} submitted`);
  } else {
    console.error("Sequence data not found:", {
      sequence,
      blockNumber,
    });
  }
  proverLock = false;
}
