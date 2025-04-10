import { describe, it } from "node:test";
import assert from "node:assert";

import {
  saveToWalrus,
  readFromWalrus,
  getWalrusUrl,
  readFromDA,
} from "@dex-agent/lib";
import { readFile } from "node:fs/promises";
let blobId1: string | undefined = undefined;
let blobId2: string | undefined = undefined;
describe("Walrus", async () => {
  it("should save to Walrus", async () => {
    blobId1 = await saveToWalrus({
      data: JSON.stringify(
        {
          message: "Hello, world!",
          date: new Date().toLocaleString(),
        },
        null,
        2
      ),
      numEpochs: 53,
    });
    assert.ok(blobId1, "blobId is not set");
  });

  it("should save to Walrus big file", async () => {
    //await new Promise((resolve) => setTimeout(resolve, 10000));
    const circuit = await readFile(
      "../contracts/src/contracts/rollup.ts",
      "utf-8"
    );
    console.log("circuit text size:", circuit.length);
    blobId2 = await saveToWalrus({
      data: circuit,
      numEpochs: 53,
    });
    assert.ok(blobId2, "blobId is not set");
  });

  it("should read from Walrus", async () => {
    if (!blobId1) {
      throw new Error("blobId is not set");
    }
    const blob = await readFromWalrus({
      blobId: blobId1,
    });
    console.log("blob", blob);
    assert.ok(blob, "blob is not received");
  });

  it("should read from Walrus big file", async () => {
    if (!blobId2) {
      throw new Error("blobId is not set");
    }
    const blob = await readFromWalrus({
      blobId: blobId2,
    });
    //console.log("blob", blob);
    assert.ok(blob, "blob is not received");
  });

  it("should get Walrus url", async () => {
    if (!blobId1) {
      throw new Error("blobId is not set");
    }
    const url = await getWalrusUrl({ blobId: blobId1 });
    console.log("url", url);
    assert.ok(url, "url is not set");
  });
});
