import { Field, PublicKey, UInt64 } from "o1js";
import { Operation, DEX_SIGNATURE_CONTEXT } from "@dex-agent/lib";

export function getMinaSignatureData(params: {
  poolPublicKey: PublicKey;
  operation: Operation;
  nonce: UInt64;
  baseTokenAmount?: UInt64;
  quoteTokenAmount?: UInt64;
  price?: UInt64;
  receiverPublicKey?: PublicKey;
}) {
  const {
    poolPublicKey,
    operation,
    nonce,
    baseTokenAmount,
    quoteTokenAmount,
    price,
    receiverPublicKey,
  } = params;
  const minaData: Field[] = [
    Field(DEX_SIGNATURE_CONTEXT),
    poolPublicKey.x,
    poolPublicKey.isOdd.toField(),
    Field(operation),
    nonce.value,
  ];
  if (baseTokenAmount !== undefined) minaData.push(baseTokenAmount.value);
  if (quoteTokenAmount !== undefined) minaData.push(quoteTokenAmount.value);
  if (price !== undefined) minaData.push(price.value);
  if (receiverPublicKey !== undefined)
    minaData.push(receiverPublicKey.x, receiverPublicKey.isOdd.toField());
  return minaData;
}
