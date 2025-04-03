import { Cloud, zkCloudWorker } from "@silvana-one/prover";
import { initBlockchain } from "@silvana-one/mina-utils";
import { initializeBindings } from "o1js";
import { DEXAgent } from "./src/agent.js";

export async function zkcloudworker(cloud: Cloud): Promise<zkCloudWorker> {
  await initializeBindings();
  await initBlockchain(cloud.chain);
  return new DEXAgent(cloud);
}
