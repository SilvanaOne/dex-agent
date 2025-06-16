import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { Operation, OperationNames } from "./types.js";
import { LastTransactionData } from "./types.js";
import { executeTx } from "./execute.js";
import { agentProve, agentSettle } from "./agent.js";

export async function executeOperationTx(params: {
  operation: Operation;
  tx: Transaction;
  keyPair: Ed25519Keypair;
  useParallelExecutor?: boolean;
}): Promise<Partial<LastTransactionData> | undefined> {
  const { tx, keyPair, useParallelExecutor = false, operation } = params;
  const executedTx = await executeTx({
    tx,
    keyPair,
    useParallelExecutor,
  });
  if (!executedTx) {
    return undefined;
  }
  const events = executedTx?.tx.events;
  const event = events?.find(
    (event) => event.transactionModule === "transactions"
  );
  //console.log("event", event?.parsedJson);
  const blockNumber = Number(
    (event?.parsedJson as any)?.operation?.block_number ?? 0
  );
  const sequence = Number((event?.parsedJson as any)?.operation?.sequence ?? 0);
  const operationCheck = Number(
    (event?.parsedJson as any)?.operation?.operation ?? 0
  );
  if (
    operationCheck !== operation &&
    (operation === Operation.TRADE ||
      operation === Operation.TRANSFER ||
      operation === Operation.CREATE_ACCOUNT ||
      operation === Operation.BID ||
      operation === Operation.ASK)
  ) {
    throw new Error(
      `Operation mismatch: expected ${operation}, got ${operationCheck}`
    );
  }
  const operationName =
    operation && typeof operation === "number"
      ? OperationNames[operation]
      : "unknown";

  const executeTime = executedTx?.executeTime ?? 0;
  console.log(`${operationName} execute, ms:`, executeTime);

  if (executedTx?.tx.effects?.status?.status === "failure") {
    console.log(
      `Errors for tx ${executedTx.digest}:`,
      executedTx.tx.effects?.status?.error
    );
    throw new Error(`${operationName} execution failed: ${executedTx.digest}`);
  }
  let answer: any;
  switch (operation) {
    case Operation.CREATE_ACCOUNT:
    case Operation.BID:
    case Operation.ASK:
    case Operation.TRANSFER:
    case Operation.TRADE:
      answer = await agentProve();
      break;
    case Operation.CREATE_BLOCK:
    case Operation.DATA_AVAILABILITY:
      break;
    default:
      console.log(`Unknown operation: ${operation}`);
      answer = `Unknown operation: ${operation}`;
      break;
  }
  if (answer) {
    console.log(`Answer for ${operationName}:`, answer);
  }
  return {
    digest: executedTx?.digest,
    executeTime,
    operationName,
    blockNumber,
    sequence,
    operation,
  };
}
