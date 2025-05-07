import { ethers } from "ethers";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check if the process.env object is empty
if (!Object.keys(process.env).length) {
  throw new Error("process.env object is empty");
}

// Setup env variables
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY!, provider);
let chainId = 17000;

const avsDeploymentData = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, `../deployments/silvana/${chainId}.json`),
    "utf8"
  )
);

const silvanaServiceManagerAddress =
  avsDeploymentData.addresses.silvanaServiceManager;
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

// Function to generate random names
function generateRandomName(): string {
  const adjectives = ["Quick", "Lazy", "Sleepy", "Noisy", "Hungry"];
  const nouns = ["Fox", "Dog", "Cat", "Mouse", "Bear"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomName = `${adjective}${noun}${Math.floor(Math.random() * 1000)}`;
  return randomName;
}

async function createNewTask(taskName: string) {
  try {
    // Send a transaction to the createNewTask function
    const tx = await silvanaServiceManager.createNewTask(taskName);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();

    console.log(`Transaction successful with hash: ${receipt.hash}`);
  } catch (error) {
    console.error("Error sending transaction:", error);
  }
}

// Function to create a new task with a random name every 15 seconds
async function startCreatingTasks() {
  while (true) {
    const randomName = generateRandomName();
    console.log(`Creating new task with name: ${randomName}`);
    await createNewTask(randomName);
    console.log(`Task created with name: ${randomName}`);
    await sleep(120000);
  }
}

// Start the process
startCreatingTasks();

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
