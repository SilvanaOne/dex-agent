import { describe, it } from "node:test";
import assert from "node:assert";
import {
  publicKeyToU256,
  convertMinaPublicKeyToFields,
  convertFieldsToPublicKey,
  u256ToFields,
} from "../src";

const base58 = "B62qpCTWDuUBJnkCuAyYK1Rfek6uYAV8YmgiBqL5oFCwkJqykRjLZrA";

describe("PublicKey", async () => {
  it("should convert mina public key", async () => {
    const u256 = publicKeyToU256(base58);
    console.log(u256);
    const fields = u256ToFields(u256);
    console.log(fields);
    const publicKey = convertFieldsToPublicKey(fields);
    console.log(publicKey);
    assert.strictEqual(publicKey, base58);
  });
});
