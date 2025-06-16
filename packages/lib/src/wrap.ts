"use server";
import { MinaSignature, Operation, DEX_SIGNATURE_CONTEXT } from "./types.js";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { bcs } from "@mysten/sui/bcs";
import { publicKeyToU256 } from "./public-key.js";
import { verifyFields } from "./public-key.js";
//import secp256k1 from "secp256k1";
//import crypto from "crypto";
import { prepareSignPayload } from "./sign.js";
import {
  convertMinaSignatureFromBase58,
  convertMinaSignatureToBase58,
} from "./base58/index.js";

export interface WrapMinaSignatureParams {
  minaSignature: string | MinaSignature;
  minaPublicKey: string;
  poolPublicKey: string;
  operation: Operation;
  nonce: bigint;
  baseTokenAmount?: bigint; // u64
  quoteTokenAmount?: bigint; // u64
  price?: bigint; // u64
  receiverPublicKey?: string;
}

export async function wrapMinaSignature(
  params: WrapMinaSignatureParams
): Promise<{
  minaSignature: MinaSignature;
  suiSignature: number[];
  minaData: bigint[];
  suiData: number[];
}> {
  const {
    minaPublicKey,
    poolPublicKey,
    operation,
    nonce,
    baseTokenAmount,
    quoteTokenAmount,
    price,
    receiverPublicKey,
  } = params;
  const minaSignature =
    typeof params.minaSignature === "string"
      ? convertMinaSignatureFromBase58(params.minaSignature)
      : params.minaSignature;
  const minaSignatureBase58 = convertMinaSignatureToBase58(minaSignature);
  if (
    typeof params.minaSignature === "string" &&
    params.minaSignature !== minaSignatureBase58
  ) {
    throw new Error("wrapMinaSignature: Invalid mina signature");
  }
  const minaData = prepareSignPayload({
    ...params,
  });
  const valid = verifyFields({
    publicKey: minaPublicKey,
    fields: minaData,
    signature: minaSignatureBase58,
  });
  if (!valid) {
    throw new Error("wrapMinaSignature: Invalid mina signature");
  }

  let suiData = new Uint8Array([
    ...bcs.u256().serialize(DEX_SIGNATURE_CONTEXT).toBytes(),
    ...bcs.u256().serialize(minaSignature.r).toBytes(),
    ...bcs.u256().serialize(minaSignature.s).toBytes(),
    ...bcs.u256().serialize(publicKeyToU256(poolPublicKey)).toBytes(),
    ...bcs.u8().serialize(operation).toBytes(),
    ...bcs.u256().serialize(publicKeyToU256(minaPublicKey)).toBytes(),
    ...bcs.u64().serialize(nonce).toBytes(),
  ]);
  if (baseTokenAmount !== undefined) {
    suiData = new Uint8Array([
      ...suiData,
      ...bcs.u64().serialize(baseTokenAmount).toBytes(),
    ]);
  }
  if (quoteTokenAmount !== undefined) {
    suiData = new Uint8Array([
      ...suiData,
      ...bcs.u64().serialize(quoteTokenAmount).toBytes(),
    ]);
  }
  if (price !== undefined) {
    suiData = new Uint8Array([
      ...suiData,
      ...bcs.u64().serialize(price).toBytes(),
    ]);
  }
  if (receiverPublicKey !== undefined) {
    suiData = new Uint8Array([
      ...suiData,
      ...bcs.u256().serialize(publicKeyToU256(receiverPublicKey)).toBytes(),
    ]);
  }

  const validatorSecretKey = process.env.VALIDATOR_SECRET_KEY;
  if (!validatorSecretKey) {
    throw new Error("Missing environment variables VALIDATOR_SECRET_KEY");
  }
  const validator = Ed25519Keypair.fromSecretKey(validatorSecretKey);
  const signedData = await validator.sign(suiData);
  const suiSignature: number[] = Array.from(signedData);
  //const hash = crypto.createHash("sha256");
  //hash.update(suiData);
  //const messageHash = hash.digest();
  // const verified = secp256k1.ecdsaVerify(
  //   signedData,
  //   messageHash,
  //   validator.getPublicKey().toRawBytes()
  // );
  // if (!verified) {
  //   throw new Error("Invalid sui signature");
  // }

  return {
    minaSignature,
    suiSignature,
    minaData,
    suiData: Array.from(suiData),
  };
}
