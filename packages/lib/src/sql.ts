import {
  PrismaClient,
  Prisma,
  Operation as PrismaOperation,
} from "./prisma/client.js";
import { SequenceState, ActionRequest, Operation } from "./types.js";

const prisma = new PrismaClient({
  datasourceUrl: process.env.SILVANA_DATABASE_URL,
});

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
      baseTokenAmount: account.baseTokenBalance.amount,
      baseTokenStakedAmount: account.baseTokenBalance.stakedAmount,
      baseTokenBorrowedAmount: account.baseTokenBalance.borrowedAmount,
      quoteTokenAmount: account.quoteTokenBalance.amount,
      quoteTokenStakedAmount: account.quoteTokenBalance.stakedAmount,
      quoteTokenBorrowedAmount: account.quoteTokenBalance.borrowedAmount,
      bidAmount: account.bid.amount,
      bidPrice: account.bid.price,
      bidIsSome: account.bid.isSome,
      askAmount: account.ask.amount,
      askPrice: account.ask.price,
      askIsSome: account.ask.isSome,
      nonce: account.nonce,
    };
  });

  // Use createMany to efficiently insert all records in a single database operation
  await prisma.state.createMany({
    data: stateRecords,
    skipDuplicates: true, // Skip records that would cause unique constraint violations
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

  return await readOnlyPrisma.$executeRawUnsafe(query);
}

export async function sqlActionRequestQuery(query: string) {
  return await actionRequestOnlyPrisma.$executeRawUnsafe(query);
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
    default:
      throw new Error("Unknown action request operation");
  }

  // Store the action request in the database
  return await prisma.actionRequest.create({
    data: {
      ...actionRequest,
      operation: requestType,
      userSignatureR:
        "userSignature" in actionRequest
          ? actionRequest.userSignature?.r
          : null,
      userSignatureS:
        "userSignature" in actionRequest
          ? actionRequest.userSignature?.s
          : null,
      senderSignatureR:
        "senderSignature" in actionRequest
          ? actionRequest.senderSignature?.r
          : null,
      senderSignatureS:
        "senderSignature" in actionRequest
          ? actionRequest.senderSignature?.s
          : null,
      status: "PENDING",
    },
  });
}
