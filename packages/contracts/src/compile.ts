import { Cache, VerificationKey } from "o1js";
import { DEXProgram } from "./contracts/rollup.js";

let vk: VerificationKey | undefined = undefined;

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
