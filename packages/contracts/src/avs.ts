import { prove } from "./prove.js";
import { merge } from "./merge.js";
import { Cache } from "o1js";
import { agentMetadata, returnUserKey } from "@dex-agent/lib";
import { clearProverSecretKey } from "./proof.js";

export async function avs(params: { endTime: number }) {
  const { endTime } = params;
  const cache = Cache.FileSystem("./cache");

  const jobIdProve = makeJobId();
  const jobIdMerge = makeJobId();
  let startTime = Date.now();

  const proveResult = await prove({
    jobId: jobIdProve,
    endTime,
    cache,
  });

  if (proveResult.count !== 0) {
    console.log("prove:", JSON.stringify(proveResult, null, 2));
    await agentMetadata({
      jobId: jobIdProve,
      result: "success",
      timeFinished: Date.now(),
      timeCreated: startTime,
      description: "EigenLayer AVS Prove",
      metadata: proveResult.metadata,
    });
  }

  startTime = Date.now();
  const mergeResult = await merge({
    jobId: jobIdMerge,
    endTime,
    cache,
  });
  if (mergeResult.count !== 0) {
    console.log("merge:", JSON.stringify(mergeResult, null, 2));
    await agentMetadata({
      jobId: jobIdMerge,
      result: "success",
      timeFinished: Date.now(),
      timeCreated: startTime,
      description: "EigenLayer AVS Merge",
      metadata: mergeResult.metadata,
    });
  }
  await returnUserKey();
  await clearProverSecretKey();
  return {
    proveResult,
    mergeResult,
  };
}

function makeJobId() {
  const randomString = generateBase56String(45);
  const jobId: string = "eigenLayer_" + randomString;
  return jobId;

  function generateBase56String(length: number): string {
    const base56Chars =
      "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz"; // Base56 excludes 0, O, I, l, 1
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * base56Chars.length);
      result += base56Chars.charAt(randomIndex);
    }
    return result;
  }
}
