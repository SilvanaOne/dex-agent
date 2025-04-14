"use server";
import {
  PrismaClient,
  Prisma,
  Operation as PrismaOperation,
  ActionStatus,
  ActionRequest as PrismaActionRequest,
} from "./prisma/client.js";
import { SequenceState, ActionRequest, Operation } from "./types.js";

export type { ActionStatus, PrismaOperation, PrismaActionRequest };

export async function getPrismaObjects() {
  return { ActionStatus, PrismaOperation };
}

// Using a type-only import for PrismaClient
type GlobalPrisma = {
  prisma?: PrismaClient;
};

// Safe access to global prisma instance
const globalForPrisma = global as unknown as GlobalPrisma;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: process.env.SILVANA_DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function addFetchedSequence(sequence: bigint) {
  if (await isSequenceFetched(sequence)) {
    return;
  }
  await prisma.fetchedSequences.create({
    data: {
      sequence,
    },
  });
}

export async function getFetchedSequences(): Promise<bigint[]> {
  return (await prisma.fetchedSequences.findMany()).map(
    (sequence) => sequence.sequence
  );
}

export async function isSequenceFetched(sequence: bigint): Promise<boolean> {
  return (
    (await prisma.fetchedSequences.findUnique({
      where: {
        sequence,
      },
    })) !== null
  );
}

export async function addSequenceData(data: SequenceState) {
  if (await isSequenceFetched(data.sequence)) {
    return;
  }
  // Extract all user accounts from the state data
  const stateRecords = Object.entries(data.state).map(([address, account]) => {
    return {
      sequence: data.sequence,
      address,
      baseTokenAmount: account.baseTokenBalance.amount.toString(),
      baseTokenStakedAmount: account.baseTokenBalance.stakedAmount.toString(),
      baseTokenBorrowedAmount:
        account.baseTokenBalance.borrowedAmount.toString(),
      quoteTokenAmount: account.quoteTokenBalance.amount.toString(),
      quoteTokenStakedAmount: account.quoteTokenBalance.stakedAmount.toString(),
      quoteTokenBorrowedAmount:
        account.quoteTokenBalance.borrowedAmount.toString(),
      bidAmount: account.bid.amount.toString(),
      bidPrice: account.bid.price.toString(),
      bidIsSome: account.bid.isSome,
      askAmount: account.ask.amount.toString(),
      askPrice: account.ask.price.toString(),
      askIsSome: account.ask.isSome,
      nonce: account.nonce.toString(),
    };
  });

  console.log("stateRecords", stateRecords[0]);

  // Use a transaction to make both operations atomic
  await prisma.$transaction(async (tx) => {
    // First operation: create state records
    await tx.state.createMany({
      data: stateRecords,
      skipDuplicates: true, // Skip records that would cause unique constraint violations
    });

    // Second operation: record that we've fetched this sequence
    await tx.fetchedSequences.create({
      data: {
        sequence: data.sequence,
      },
    });
  });
}

const readOnlyPrisma = prisma.$extends({
  query: {
    $allModels: {
      create: () => {
        throw new Error("Write operations not allowed");
      },
      createMany: () => {
        throw new Error("Write operations not allowed");
      },
      update: () => {
        throw new Error("Write operations not allowed");
      },
      updateMany: () => {
        throw new Error("Write operations not allowed");
      },
      delete: () => {
        throw new Error("Write operations not allowed");
      },
      deleteMany: () => {
        throw new Error("Write operations not allowed");
      },
      upsert: () => {
        throw new Error("Write operations not allowed");
      },
    },
  },
});

const actionRequestOnlyPrisma = prisma.$extends({
  query: {
    $allModels: {
      create: ({ model, args, query }) => {
        if (model === "ActionRequest") {
          return query(args);
        }
        throw new Error("Only ActionRequest create operations are allowed");
      },
      createMany: ({ model, args, query }) => {
        if (model === "ActionRequest") {
          return query(args);
        }
        throw new Error("Only ActionRequest createMany operations are allowed");
      },
      update: () => {
        throw new Error("Write operations not allowed");
      },
      updateMany: () => {
        throw new Error("Write operations not allowed");
      },
      delete: () => {
        throw new Error("Write operations not allowed");
      },
      deleteMany: () => {
        throw new Error("Write operations not allowed");
      },
      upsert: () => {
        throw new Error("Write operations not allowed");
      },
    },
  },
});

export async function sqlReadOnlyQuery(query: string) {
  // Still validate the query is SELECT-only
  const trimmedQuery = query.trim().toLowerCase();
  if (!trimmedQuery.startsWith("select")) {
    throw new Error("Only SELECT queries are allowed");
  }

  const results = await readOnlyPrisma.$queryRawUnsafe(query);
  return results;
}

export async function sqlActionRequestQuery(
  query: string
): Promise<{ success: boolean; data: unknown; error: string | undefined }> {
  try {
    const result = await actionRequestOnlyPrisma.$queryRawUnsafe(query);
    return { success: true, data: result, error: undefined };
  } catch (error: any) {
    return { success: false, data: undefined, error: error?.message };
  }
}

// UNSAFE, use with caution
// export async function sqlQuery(query: string) {
//   return await prisma.$executeRawUnsafe(query);
// }

export async function sqlListTables() {
  return await prisma.$queryRaw(Prisma.sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);
}

export async function sqlGetTableStructure(tableName: string) {
  return await prisma.$queryRaw(Prisma.sql`
    SELECT 
      column_name, 
      data_type, 
      is_nullable, 
      column_default,
      character_maximum_length
    FROM 
      information_schema.columns 
    WHERE 
      table_schema = 'public' 
      AND table_name = ${tableName}
    ORDER BY 
      ordinal_position
  `);
}

/**
 * Adds an action request to the database
 * @param actionRequest The action request to add
 * @returns The created action request record
 */
export async function addActionRequest(actionRequest: ActionRequest) {
  // Determine the type of action request based on the operation field
  let requestType: PrismaOperation;

  switch (actionRequest.operation) {
    case Operation.CREATE_ACCOUNT:
      requestType = PrismaOperation.CREATE_ACCOUNT;
      break;
    case Operation.BID:
      requestType = PrismaOperation.BID;
      break;
    case Operation.ASK:
      requestType = PrismaOperation.ASK;
      break;
    case Operation.TRADE:
      requestType = PrismaOperation.TRADE;
      break;
    case Operation.TRANSFER:
      requestType = PrismaOperation.TRANSFER;
      break;
    case Operation.PROOF:
      requestType = PrismaOperation.PROOF;
      break;
    default:
      throw new Error("Unknown action request operation");
  }

  // Store the action request in the database
  return await prisma.actionRequest.create({
    data: {
      ...actionRequest,
      operation: requestType,
      sequence:
        "sequence" in actionRequest
          ? Prisma.Decimal(actionRequest.sequence.toString())
          : null,
      baseBalance:
        "baseBalance" in actionRequest
          ? Prisma.Decimal(actionRequest.baseBalance.toString())
          : null,
      quoteBalance:
        "quoteBalance" in actionRequest
          ? Prisma.Decimal(actionRequest.quoteBalance.toString())
          : null,
      baseTokenAmount:
        "baseTokenAmount" in actionRequest
          ? Prisma.Decimal(actionRequest.baseTokenAmount.toString())
          : null,
      quoteTokenAmount:
        "quoteTokenAmount" in actionRequest
          ? Prisma.Decimal(actionRequest.quoteTokenAmount.toString())
          : null,
      userSignatureR:
        "userSignature" in actionRequest
          ? Prisma.Decimal(actionRequest.userSignature?.r.toString())
          : null,
      userSignatureS:
        "userSignature" in actionRequest
          ? Prisma.Decimal(actionRequest.userSignature?.s.toString())
          : null,
      senderSignatureR:
        "senderSignature" in actionRequest
          ? Prisma.Decimal(actionRequest.senderSignature?.r.toString())
          : null,
      senderSignatureS:
        "senderSignature" in actionRequest
          ? Prisma.Decimal(actionRequest.senderSignature?.s.toString())
          : null,
      price:
        "price" in actionRequest
          ? Prisma.Decimal(actionRequest.price.toString())
          : null,
      nonce:
        "nonce" in actionRequest
          ? Prisma.Decimal(actionRequest.nonce.toString())
          : null,
      buyerNonce:
        "buyerNonce" in actionRequest
          ? Prisma.Decimal(actionRequest.buyerNonce.toString())
          : null,
      sellerNonce:
        "sellerNonce" in actionRequest
          ? Prisma.Decimal(actionRequest.sellerNonce.toString())
          : null,
      senderNonce:
        "senderNonce" in actionRequest
          ? Prisma.Decimal(actionRequest.senderNonce.toString())
          : null,
      receiverNonce:
        "receiverNonce" in actionRequest
          ? Prisma.Decimal(actionRequest.receiverNonce.toString())
          : null,
      blockNumber:
        "blockNumber" in actionRequest
          ? Prisma.Decimal(actionRequest.blockNumber.toString())
          : null,
      status: ActionStatus.PENDING,
    },
  });
}

export async function setSqlRequestStatus(params: {
  requestId: number;
  status: ActionStatus;
  digest?: string;
  da_hash?: string;
  jobId?: string;
}) {
  const { requestId, status, digest, da_hash, jobId } = params;
  await prisma.actionRequest.update({
    where: { id: requestId },
    data: { status, digest, da_hash, jobId },
  });
}

export async function getSqlRequestStatus(params: { requestId: number }) {
  const { requestId } = params;
  // Use a transaction to ensure we get the latest data
  return await prisma.$transaction(async (tx) => {
    return tx.actionRequest.findUnique({
      where: { id: requestId },
    });
  });
}

export async function getUnprocessedSqlRequests() {
  return await prisma.actionRequest.findMany({
    where: { status: ActionStatus.PENDING },
    orderBy: { createdAt: "asc" },
  });
}

export async function setSqlRequestProcessing(params: {
  requestId: number;
  agent: string;
  jobId?: string;
}) {
  const { requestId, agent, jobId } = params;
  await prisma.actionRequest.update({
    where: { id: requestId },
    data: { status: ActionStatus.PROCESSING, agent, jobId },
  });
}
