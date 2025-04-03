import {
  RawOperationEvent,
  OperationEvent,
  RollupEvent,
  RollupEventType,
  ProofStartedEvent,
  ProofSubmittedEvent,
  ProofUsedEvent,
  ProofReservedEvent,
  ProofReturnedEvent,
  ProofRejectedEvent,
  ProofCalculationCreatedEvent,
  BlockProofEvent,
  RawEvent,
  MinaTransactionEvent,
} from "./types.js";
import { u256ToPublicKey } from "./public-key.js";

export function convertRawOperationEvent(
  raw: RawOperationEvent
): OperationEvent {
  const details = raw.details;
  if (details.userPublicKey) {
    details.userPublicKey = u256ToPublicKey(BigInt(raw.details.userPublicKey));
  }
  if (details.userSignature) {
    details.userSignature = {
      r: BigInt(raw.details.userSignature.r),
      s: BigInt(raw.details.userSignature.s),
    };
  }
  if (details.senderSignature) {
    details.senderSignature = {
      r: BigInt(raw.details.senderSignature.r),
      s: BigInt(raw.details.senderSignature.s),
    };
  }
  if (details.amount) {
    details.amount = BigInt(raw.details.amount);
  }
  if (details.nonce) {
    details.nonce = Number(raw.details.nonce);
  }
  if (details.poolPublicKey) {
    details.poolPublicKey = u256ToPublicKey(BigInt(raw.details.poolPublicKey));
  }
  if (details.price) {
    details.price = BigInt(raw.details.price);
  }
  if (details.isSome) {
    details.isSome = raw.details.isSome;
  }
  if (details.buyerPublicKey) {
    details.buyerPublicKey = u256ToPublicKey(
      BigInt(raw.details.buyerPublicKey)
    );
  }
  if (details.sellerPublicKey) {
    details.sellerPublicKey = u256ToPublicKey(
      BigInt(raw.details.sellerPublicKey)
    );
  }
  if (details.senderPublicKey) {
    details.senderPublicKey = u256ToPublicKey(
      BigInt(raw.details.senderPublicKey)
    );
  }
  if (details.receiverPublicKey) {
    details.receiverPublicKey = u256ToPublicKey(
      BigInt(raw.details.receiverPublicKey)
    );
  }
  if (details.senderNonce) {
    details.senderNonce = Number(raw.details.senderNonce);
  }
  if (details.receiverNonce) {
    details.receiverNonce = Number(raw.details.receiverNonce);
  }
  if (details.quoteAmount) {
    details.quoteAmount = BigInt(raw.details.quoteAmount);
  }
  if (details.buyerNonce) {
    details.buyerNonce = Number(raw.details.buyerNonce);
  }
  if (details.sellerNonce) {
    details.sellerNonce = Number(raw.details.sellerNonce);
  }
  if (details.baseBalance) {
    details.baseBalance = BigInt(raw.details.baseBalance);
  }
  if (details.quoteBalance) {
    details.quoteBalance = BigInt(raw.details.quoteBalance);
  }

  if (details.baseTokenAmount) {
    details.baseTokenAmount = BigInt(raw.details.baseTokenAmount);
  }
  if (details.quoteTokenAmount) {
    details.quoteTokenAmount = BigInt(raw.details.quoteTokenAmount);
  }

  return {
    type: raw.type,
    details,
    operation: {
      actionState: raw.operation.actionState,
      data: raw.operation.data,
      operation: raw.operation.operation,
      pool: raw.operation.pool,
      poolPublicKey: raw.operation.poolPublicKey,
      sequence: Number(raw.operation.sequence),
      blockNumber: Number(raw.operation.block_number),
    },
    timestamp: raw.timestamp,
  };
}

export function convertRollupEvent(raw: RawEvent): RollupEvent {
  const base = {
    type: raw.type as RollupEventType,
    digest: raw.digest,
    block_number: BigInt(raw.data.block_number),
    timestamp: raw.timestamp,
  };

  switch (raw.type) {
    case "ProofStartedEvent":
      return {
        ...base,
        sequences: raw.data.sequences.map(Number),
        prover: raw.data.prover,
      } as ProofStartedEvent;

    case "ProofSubmittedEvent":
      return {
        ...base,
        sequences: raw.data.sequences.map(Number),
        da_hash: raw.data.da_hash,
        prover: raw.data.prover,
        cpu_time: Number(raw.data.cpu_time),
        cpu_cores: raw.data.cpu_cores,
        prover_memory: BigInt(raw.data.prover_memory),
        prover_architecture: raw.data.prover_architecture,
      } as ProofSubmittedEvent;

    case "ProofUsedEvent":
      return {
        ...base,
        sequences: raw.data.sequences.map(Number),
        da_hash: raw.data.da_hash,
        user: raw.data.user,
      } as ProofUsedEvent;

    case "ProofReservedEvent":
      return {
        ...base,
        sequences: raw.data.sequences.map(Number),
        da_hash: raw.data.da_hash,
        user: raw.data.user,
      } as ProofReservedEvent;

    case "ProofReturnedEvent":
      return {
        ...base,
        sequences: raw.data.sequences.map(Number),
        da_hash: raw.data.da_hash,
      } as ProofReturnedEvent;

    case "ProofRejectedEvent":
      return {
        ...base,
        sequences: raw.data.sequences.map(Number),
        da_hash: raw.data.da_hash,
        verifier: raw.data.verifier,
      } as ProofRejectedEvent;

    case "ProofCalculationCreatedEvent":
      return {
        ...base,
        start_sequence: BigInt(raw.data.start_sequence),
        end_sequence: raw.data.end_sequence
          ? BigInt(raw.data.end_sequence)
          : undefined,
        circuit: raw.data.circuit,
      } as ProofCalculationCreatedEvent;

    case "BlockProofEvent":
      return {
        ...base,
        start_sequence: BigInt(raw.data.start_sequence),
        end_sequence: BigInt(raw.data.end_sequence),
        da_hash: raw.data.da_hash,
      } as BlockProofEvent;

    case "MinaTransactionEvent":
      return {
        ...base,
        start_sequence: BigInt(raw.data.start_sequence),
        end_sequence: BigInt(raw.data.end_sequence),
        state_data_availability: raw.data.state_data_availability,
        proof_data_availability: raw.data.proof_data_availability,
        mina_tx_hash: raw.data.mina_tx_hash,
        mina_tx_included_in_block: raw.data.mina_tx_included_in_block,
        sent_to_mina_at: Number(raw.data.sent_to_mina_at),
        settled_on_mina_at: raw.data.settled_on_mina_at
          ? Number(raw.data.settled_on_mina_at)
          : null,
      } as MinaTransactionEvent;

    default:
      throw new Error(`Unknown proof event type: ${raw.type}`);
  }
}
