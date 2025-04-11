import { describe, it } from "node:test";
import assert from "node:assert";
import { setNumberOfWorkers } from "o1js";
import { zkCloudWorkerClient } from "@silvana-one/mina-prover";
import { Memory } from "@silvana-one/mina-utils";
import { JobResult } from "@silvana-one/api";
import { zkcloudworker } from "../index.js";
import { processArguments } from "./helpers/utils.js";

const JWT: string = process.env.JWT!;

setNumberOfWorkers(8);

const args = processArguments();
console.log("args:", args);
const { chain, useLocalCloudWorker } = args;

const api = new zkCloudWorkerClient({
  jwt: useLocalCloudWorker ? "local" : JWT,
  zkcloudworker: zkcloudworker as any,
  chain,
});

describe("DEX Agent", async () => {
  it(`should call execute`, async () => {
    console.time(`executed`);
    const args = JSON.stringify({
      address: "B62qo69VLUPMXEC6AFWRgjdTEGsA3xKvqeU5CgYm3jAbBJL7dTvaQkv",
      sequence: 47,
      blockNumber: 28,
    });
    const answer = await api.execute({
      developer: "DFST",
      repo: "dex-agent",
      transactions: [],
      task: "proveAccount",
      args,
      metadata: `prove account`,
    });
    console.log("answer:", answer);
    assert.ok(answer, "Answer should be defined");
    assert.strictEqual(answer.success, true, "Expected success to be true");
    const jobId = answer.jobId;
    assert.ok(jobId, "Job ID should be defined");
    if (jobId === undefined) throw new Error("Job ID is undefined");
    const result = await api.waitForJobResult({
      jobId,
      printLogs: true,
    });
    console.log("result:", result.result.result);

    console.timeEnd(`executed`);
    Memory.info(`executed`);
  });
});
