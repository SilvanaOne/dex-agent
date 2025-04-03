import { describe, it } from "node:test";
import assert from "node:assert";
import { convertMinaSignature } from "../src/base58/signature";

// minaSignature: {
//   r: 546246321296461479822570209746560852569104261598625812628196326313651920260n,
//   s: 7096516123182135153371150919930557939174771140710484767474512756576314710478n
// },
const base58 =
  "7mXFyvfYFKAuEQhrtnudxN7WXa7EKUAEHJzjWBha8HngaVEtq9PptyhdyvtAdeEucYHWkhJjRA96LPwrS7swhtqnmzegMGHW";

describe("Signature", async () => {
  it("should convert mina signature", async () => {
    const minaSignature = convertMinaSignature(base58);
    console.log(minaSignature);
  });
});
