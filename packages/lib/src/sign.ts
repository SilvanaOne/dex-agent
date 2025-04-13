import { MinaSignature, Operation, DEX_SIGNATURE_CONTEXT } from "./types.js";
import {
  convertMinaPublicKeyToFields,
  signFields,
  verifyFields,
} from "./public-key.js";
import { convertMinaSignatureFromBase58 } from "./base58/index.js";

export function prepareSignPayload(params: {
  poolPublicKey: string;
  operation: Operation;
  nonce: bigint;
  baseTokenAmount?: bigint; // u64
  quoteTokenAmount?: bigint; // u64
  price?: bigint; // u64
  receiverPublicKey?: string;
}): bigint[] {
  const {
    poolPublicKey,
    operation,
    nonce,
    baseTokenAmount,
    quoteTokenAmount,
    price,
    receiverPublicKey,
  } = params;
  const poolPublicKeyFields = convertMinaPublicKeyToFields(poolPublicKey);
  const receiverPublicKeyFields =
    convertMinaPublicKeyToFields(receiverPublicKey);
  const minaData: bigint[] = [
    BigInt(DEX_SIGNATURE_CONTEXT),
    ...poolPublicKeyFields,
    BigInt(operation),
    BigInt(nonce),
  ];
  if (baseTokenAmount !== undefined) minaData.push(baseTokenAmount);
  if (quoteTokenAmount !== undefined) minaData.push(quoteTokenAmount);
  if (price !== undefined) minaData.push(price);
  if (receiverPublicKey !== undefined)
    minaData.push(...receiverPublicKeyFields);
  return minaData;
}

export async function signDexFields(params: {
  minaPrivateKey: string;
  poolPublicKey: string;
  operation: Operation;
  nonce: bigint;
  baseTokenAmount?: bigint; // u64
  quoteTokenAmount?: bigint; // u64
  price?: bigint; // u64
  receiverPublicKey?: string;
}): Promise<{
  minaSignatureBase58: string;
  minaSignature: MinaSignature;
  minaData: bigint[];
}> {
  const minaData = prepareSignPayload(params);
  const signedData = signFields({
    privateKey: params.minaPrivateKey,
    fields: minaData,
  });
  const minaSignature = convertMinaSignatureFromBase58(signedData.signature);

  const valid = verifyFields({
    publicKey: signedData.publicKey,
    fields: minaData,
    signature: signedData.signature,
  });
  if (!valid) {
    throw new Error("signDexFields: Invalid mina signature");
  }

  return {
    minaSignatureBase58: signedData.signature,
    minaSignature,
    minaData,
  };
}
