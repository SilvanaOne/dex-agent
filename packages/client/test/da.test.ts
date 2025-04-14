import { describe, it } from "node:test";
import assert from "node:assert";

import { saveToDA, readFromDA, getDAUrl } from "@dex-agent/lib";
import { readFile } from "node:fs/promises";
let blobId1: string | undefined = undefined;
let blobId2: string | undefined = undefined;
describe("DA", async () => {
  it("should save to DA", async () => {
    blobId1 = await saveToDA({
      data: JSON.stringify(
        {
          message: "Hello, world!",
          date: new Date().toLocaleString(),
        },
        null,
        2
      ),
      days: 50,
    });
    assert.ok(blobId1, "blobId is not set");
  });

  it("should save to DA big file", async () => {
    const circuit = await readFile(
      "../contracts/src/contracts/rollup.ts",
      "utf-8"
    );
    console.log("circuit text size:", circuit.length);
    blobId2 = await saveToDA({
      data: circuit,
      days: 50,
      filename: "rollup.ts",
      description: "Circuit for DEX",
    });
    assert.ok(blobId2, "blobId is not set");
  });

  it("should read from DA", async () => {
    if (!blobId1) {
      throw new Error("blobId is not set");
    }
    const blob = await readFromDA({
      blobId: blobId1,
    });
    console.log("blob", blob);
    assert.ok(blob, "blob is not received");
  });

  it("should read from DA big file", async () => {
    if (!blobId2) {
      throw new Error("blobId is not set");
    }
    const blob = await readFromDA({
      blobId: blobId2,
    });
    //console.log("blob", blob);
    assert.ok(blob, "blob is not received");
  });

  it("should get DA url", async () => {
    if (!blobId1) {
      throw new Error("blobId is not set");
    }
    const url = await getDAUrl({ blobId: blobId1 });
    console.log("url", url);
    assert.ok(url, "url is not set");
  });
});
