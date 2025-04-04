import { describe, it } from "node:test";
import assert from "node:assert";
import { DEXProgram, DEXContract } from "@dex-agent/contracts";
import { readFile, writeFile } from "node:fs/promises";
import { saveToDA, readFromDA } from "@dex-agent/lib";
import { Cache, VerificationKey } from "o1js";

let vkProgram: VerificationKey | null = null;
let vkContract: VerificationKey | null = null;
let blobId: string | undefined = undefined;

describe("Store circuit", async () => {
  it("should compile DEX Program", async () => {
    console.log("compiling...");
    console.time("compiled");
    const cache = Cache.FileSystem("./cache");
    const { verificationKey } = await DEXProgram.compile({ cache });
    vkProgram = verificationKey;
    console.timeEnd("compiled");
  });

  it("should compile DEX Contract", async () => {
    console.log("compiling...");
    console.time("compiled");
    const cache = Cache.FileSystem("./cache");
    const { verificationKey } = await DEXContract.compile({ cache });
    vkContract = verificationKey;
    console.timeEnd("compiled");
  });

  it("should save to walrus", async () => {
    const circuit = await readFile(
      "../contracts/src/contracts/rollup.ts",
      "utf-8"
    );
    console.log("circuit text size:", circuit.length);
    blobId = await saveToDA({
      data: circuit,
      days: 50,
      filename: "circuit.ts",
      description: "Circuit for DEX",
    });
    assert.ok(blobId, "blobId is not set");
  });

  it("should read from walrus", async () => {
    if (!blobId) {
      throw new Error("blobId is not set");
    }
    const blob = await readFromDA({
      blobId,
    });
    //console.log("blob", blob);
    assert.ok(blob, "blob is not received");
  });

  it("should save circuit address to .env.circuit", async () => {
    if (!blobId) {
      throw new Error("blobId is not set");
    }
    if (!vkProgram) {
      throw new Error("vkProgram is not set");
    }
    if (!vkContract) {
      throw new Error("vkContract is not set");
    }
    const envContent = `# Circuit blob ID
CIRCUIT_BLOB_ID=${blobId}
CIRCUIT_VERIFICATION_KEY_HASH=${vkProgram.hash.toBigInt().toString()}
CIRCUIT_VERIFICATION_KEY_DATA=${vkProgram.data}
CONTRACT_VERIFICATION_KEY_HASH=${vkContract.hash.toBigInt().toString()}
CONTRACT_VERIFICATION_KEY_DATA=${vkContract.data}
`;
    await writeFile(".env.circuit", envContent);
  });
});
