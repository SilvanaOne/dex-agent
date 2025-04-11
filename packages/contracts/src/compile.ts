import { Cache, VerificationKey } from "o1js";
import { DEXAccountProofProgram, DEXProgram } from "./contracts/rollup.js";

let vk: VerificationKey | undefined = undefined;
let vkAccount: VerificationKey | undefined = undefined;

export async function compileDEXProgram(
  cache: Cache
): Promise<VerificationKey> {
  const vk_data = process.env.CIRCUIT_VERIFICATION_KEY_DATA;
  const vk_hash = process.env.CIRCUIT_VERIFICATION_KEY_HASH;
  if (!vk_data || !vk_hash) {
    throw new Error(
      "CIRCUIT_VERIFICATION_KEY_DATA or CIRCUIT_VERIFICATION_KEY_HASH is not set"
    );
  }
  if (!vk) {
    console.log("Compiling DEX Program");
    console.time("Compiled DEX Program");
    const { verificationKey } = await DEXProgram.compile({ cache });
    vk = verificationKey;
    console.timeEnd("Compiled DEX Program");
  }
  if (vk_data !== vk.data || vk_hash !== vk.hash.toBigInt().toString()) {
    throw new Error("Program verification key changed");
  }
  return vk;
}

export async function compileDEXAccountProofProgram(
  cache: Cache
): Promise<VerificationKey> {
  if (!vkAccount) {
    console.log("Compiling DEX Account Proof Program");
    console.time("Compiled DEX Account Proof Program");
    const { verificationKey } = await DEXAccountProofProgram.compile({
      cache,
    });
    vkAccount = verificationKey;
    console.timeEnd("Compiled DEX Account Proof Program");
  }
  return vkAccount;
}
