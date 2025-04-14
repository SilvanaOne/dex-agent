import {
  getUnprocessedSqlRequests,
  setSqlRequestProcessing,
  getSqlRequestStatus,
  getPrismaObjects,
} from "./sql.js";
import type {
  ActionStatus,
  PrismaOperation,
  PrismaActionRequest,
} from "./sql.js";
import { nanoid } from "nanoid";
import { sleep } from "./sleep.js";
import {
  ActionCreateAccountRequest,
  ActionBidRequest,
  ActionAskRequest,
  ActionTradeRequest,
  ActionTransferRequest,
  ActionRequest,
  Operation,
  ActionProofRequest,
  LastTransactionData,
} from "./types.js";
import { order } from "./order.js";
import { getUserKey } from "./key.js";
const agent = nanoid();

export async function processSqlRequests(): Promise<
  Partial<LastTransactionData>[]
> {
  const sqlRequests = await getUnprocessedSqlRequests();
  const results: Partial<LastTransactionData>[] = [];
  const { ActionStatus, PrismaOperation } = await getPrismaObjects();
  for (const sqlRequest of sqlRequests) {
    try {
      await setSqlRequestProcessing({
        requestId: sqlRequest.id,
        agent,
      });
      await sleep(1000);
    } catch (error: any) {
      console.error(
        `Error reserving request ${sqlRequest.id}:`,
        error?.message
      );
      continue;
    }
    const status = await getSqlRequestStatus({ requestId: sqlRequest.id });
    if (!status) {
      console.error(`Request ${sqlRequest.id} not found`);
      continue;
    }
    if (status.status === ActionStatus.PROCESSING && status.agent === agent) {
      console.log(`Processing request ${sqlRequest.id}`);
      const actionRequest = await convertPrismaActionRequestToActionRequest(
        sqlRequest
      );
      const result = await order({ actionRequest, key: await getUserKey() });
      console.log(`Request ${sqlRequest.id} processed`, result);
      results.push(result);
    } else {
      console.error(
        `Request ${sqlRequest.id} is not processing, taken by other agent`,
        status
      );
    }
  }
  return results;
}

async function convertPrismaActionRequestToActionRequest(
  action: PrismaActionRequest
): Promise<ActionRequest> {
  const { PrismaOperation } = await getPrismaObjects();
  console.log("convertPrismaActionRequestToActionRequest action", action);
  switch (action.operation) {
    case PrismaOperation.CREATE_ACCOUNT:
      if (
        !action.address ||
        !action.publicKey ||
        !action.poolPublicKey ||
        !action.name ||
        !action.role ||
        !action.image ||
        action.baseBalance === null ||
        action.quoteBalance === null
      ) {
        throw new Error("Missing required fields for CREATE_ACCOUNT operation");
      }

      return <ActionCreateAccountRequest>{
        operation: Operation.CREATE_ACCOUNT,
        address: action.address,
        poolPublicKey: action.poolPublicKey,
        publicKey: action.publicKey,
        publicKeyBase58: action.publicKeyBase58,
        name: action.name,
        role: action.role,
        image: action.image,
        baseBalance: BigInt(action.baseBalance.toFixed(0)),
        quoteBalance: BigInt(action.quoteBalance.toFixed(0)),
      };
    case PrismaOperation.BID:
      if (
        !action.userPublicKey ||
        !action.poolPublicKey ||
        action.price === null ||
        action.baseTokenAmount === null ||
        action.nonce === null ||
        action.userSignatureR === null ||
        action.userSignatureS === null
      ) {
        throw new Error("Missing required fields for BID operation");
      }

      return <ActionBidRequest>{
        operation: Operation.BID,
        poolPublicKey: action.poolPublicKey,
        userPublicKey: action.userPublicKey,
        baseTokenAmount: BigInt(action.baseTokenAmount.toFixed(0)),
        price: BigInt(action.price.toFixed(0)),
        isSome: action.isSome || false,
        nonce: BigInt(action.nonce.toFixed(0)),
        userSignature: {
          r: BigInt(action.userSignatureR.toFixed(0)),
          s: BigInt(action.userSignatureS.toFixed(0)),
        },
      };
    case PrismaOperation.ASK:
      if (
        !action.userPublicKey ||
        !action.poolPublicKey ||
        action.price === null ||
        action.baseTokenAmount === null ||
        action.nonce === null ||
        action.userSignatureR === null ||
        action.userSignatureS === null
      ) {
        throw new Error("Missing required fields for ASK operation");
      }
      return <ActionAskRequest>{
        operation: Operation.ASK,
        poolPublicKey: action.poolPublicKey,
        userPublicKey: action.userPublicKey,
        baseTokenAmount: BigInt(action.baseTokenAmount.toFixed(0)),
        price: BigInt(action.price.toFixed(0)),
        isSome: action.isSome || false,
        nonce: BigInt(action.nonce.toFixed(0)),
        userSignature: {
          r: BigInt(action.userSignatureR.toFixed(0)),
          s: BigInt(action.userSignatureS.toFixed(0)),
        },
      };
    case PrismaOperation.TRADE:
      if (
        !action.buyerPublicKey ||
        !action.sellerPublicKey ||
        !action.poolPublicKey ||
        action.baseTokenAmount === null ||
        action.quoteTokenAmount === null ||
        action.price === null ||
        action.buyerNonce === null ||
        action.sellerNonce === null
      ) {
        throw new Error("Missing required fields for TRADE operation");
      }
      return <ActionTradeRequest>{
        operation: Operation.TRADE,
        poolPublicKey: action.poolPublicKey,
        buyerPublicKey: action.buyerPublicKey,
        sellerPublicKey: action.sellerPublicKey,
        baseTokenAmount: BigInt(action.baseTokenAmount.toFixed(0)),
        quoteTokenAmount: BigInt(action.quoteTokenAmount.toFixed(0)),
        price: BigInt(action.price.toFixed(0)),
        buyerNonce: BigInt(action.buyerNonce.toFixed(0)),
        sellerNonce: BigInt(action.sellerNonce.toFixed(0)),
      };
    case PrismaOperation.TRANSFER:
      if (
        !action.senderPublicKey ||
        !action.receiverPublicKey ||
        !action.poolPublicKey ||
        action.baseTokenAmount === null ||
        action.quoteTokenAmount === null ||
        action.senderNonce === null ||
        action.receiverNonce === null ||
        action.senderSignatureR === null ||
        action.senderSignatureS === null
      ) {
        throw new Error("Missing required fields for TRANSFER operation");
      }
      return <ActionTransferRequest>{
        operation: Operation.TRANSFER,
        poolPublicKey: action.poolPublicKey,
        senderPublicKey: action.senderPublicKey,
        receiverPublicKey: action.receiverPublicKey,
        baseTokenAmount: BigInt(action.baseTokenAmount.toFixed(0)),
        quoteTokenAmount: BigInt(action.quoteTokenAmount.toFixed(0)),
        senderNonce: BigInt(action.senderNonce.toFixed(0)),
        receiverNonce: BigInt(action.receiverNonce.toFixed(0)),
        senderSignature: {
          r: BigInt(action.senderSignatureR.toFixed(0)),
          s: BigInt(action.senderSignatureS.toFixed(0)),
        },
      };
    case PrismaOperation.PROOF:
      if (action.sequence === null || !action.publicKeyBase58) {
        throw new Error("Missing required fields for PROOF operation");
      }
      return <ActionProofRequest>{
        operation: Operation.PROOF,
        sequence: BigInt(action.sequence.toFixed(0)),
        publicKeyBase58: action.publicKeyBase58,
      };
    default:
      throw new Error(`Unknown operation: ${action.operation}`);
  }
}
