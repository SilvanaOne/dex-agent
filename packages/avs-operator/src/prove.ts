import { ethers } from "ethers";
//import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { avs } from "@dex-agent/contracts";
//dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if the process.env object is empty
if (!Object.keys(process.env).length) {
  throw new Error("process.env object is empty");
}

// Setup env variables
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
/// TODO: Hack
let chainId = 31337;

const avsDeploymentData = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, `../deployments/silvana/${chainId}.json`),
    "utf8"
  )
);

const silvanaServiceManagerAddress =
  avsDeploymentData.addresses.silvanaServiceManager;

// Load ABIs
const delegationManagerABI = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../abis/IDelegationManager.json"),
    "utf8"
  )
);

const silvanaServiceManagerABI = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "../abis/SilvanaServiceManager.json"),
    "utf8"
  )
);

const silvanaServiceManager = new ethers.Contract(
  silvanaServiceManagerAddress,
  silvanaServiceManagerABI,
  wallet
);

const signAndRespondToTask = async (
  taskIndex: number,
  taskCreatedBlock: number,
  taskName: string
) => {
  const message = `executed: ${taskName}`;
  const messageHash = ethers.solidityPackedKeccak256(["string"], [message]);
  const messageBytes = ethers.getBytes(messageHash);
  const signature = await wallet.signMessage(messageBytes);

  console.log(`Signing and responding to task ${taskIndex}`);

  const operators = [await wallet.getAddress()];
  const signatures = [signature];
  const signedTask = ethers.AbiCoder.defaultAbiCoder().encode(
    ["address[]", "bytes[]", "uint32"],
    [operators, signatures, taskCreatedBlock]
  );

  const tx = await silvanaServiceManager.respondToTask(
    { name: taskName, taskCreatedBlock: taskCreatedBlock },
    taskIndex,
    signedTask
  );
  await tx.wait();
  console.log(`Responded to task.`);
};

const monitorNewTasks = async () => {
  //console.log(`Creating new task "EigenWorld"`);
  //await helloWorldServiceManager.createNewTask("EigenWorld");

  silvanaServiceManager.on(
    "NewTaskCreated",
    async (taskIndex: number, task: any) => {
      console.log(`New task detected: ${task.name}`);
      await signAndRespondToTask(taskIndex, task.taskCreatedBlock, task.name);
    }
  );

  console.log("Monitoring for new tasks and proof requests...");
  let i = 0;
  while (true) {
    i++;
    console.log(`Iteration ${i}`);
    const endTime = Date.now() + 1000 * 60 * 3;

    const result = await avs({ endTime });
    //console.log("avs result", JSON.stringify(result, null, 2));

    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
};

const main = async () => {
  monitorNewTasks().catch((error) => {
    console.error("Error monitoring tasks:", error);
  });
};

main().catch((error) => {
  console.error("Error in main function:", error);
});
