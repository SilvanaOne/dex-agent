"use server";
import { OrderPayload, signFields } from "@dex-agent/lib";

const ALICE_PRIVATE_KEY = process.env.ALICE_PRIVATE_KEY;

export async function signSqlRequest(payload: OrderPayload) {
  if (!ALICE_PRIVATE_KEY) {
    throw new Error("ALICE_PRIVATE_KEY is not set");
  }
  const signature = signFields({
    privateKey: ALICE_PRIVATE_KEY,
    fields: payload.payload,
  });
  return signature;
}
