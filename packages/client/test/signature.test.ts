import { describe, it } from "node:test";
import assert from "node:assert";
import { PrivateKey, Signature, Field } from "o1js";
import {
  convertMinaSignatureToBase58,
  convertMinaSignatureFromBase58,
} from "@dex-agent/lib";

describe("Test signature", async () => {
  it("should convert mina signature", async () => {
    const privateKey = PrivateKey.random();
    const publicKey = privateKey.toPublicKey();
    const minaData = [Field(1n), Field(2n), Field(3n)];
    const minaSignatureFields = Signature.create(privateKey, minaData);
    const ok = minaSignatureFields.verify(publicKey, minaData);
    assert(ok.toBoolean());
    const minaSignature = {
      r: minaSignatureFields.r.toBigInt(),
      s: minaSignatureFields.s.toBigInt(),
    };
    console.log({ minaSignature, base58: minaSignatureFields.toBase58() });

    const converted = convertMinaSignatureFromBase58(
      minaSignatureFields.toBase58()
    );
    assert.deepEqual(minaSignature, converted);
    const base58 = convertMinaSignatureToBase58(converted);
    assert.deepEqual(base58, minaSignatureFields.toBase58());
  });
});
