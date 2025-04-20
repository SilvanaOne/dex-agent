export const DEX_SIGNATURE_CONTEXT = 7738487874684489969637964886483n;

export enum Operation {
  CREATE_ACCOUNT = 1,
  BID = 2,
  ASK = 3,
  TRADE = 4,
  TRANSFER = 5,
  PROOF = 6,
  // WITHDRAW = 6,
  // DEPOSIT = 7,
  // STAKE = 8,
  // UNSTAKE = 9,
  CREATE_BLOCK = 10,
  DATA_AVAILABILITY = 11,
}

export const OperationNames: { [key: number]: string } = {
  0: "not_found",
  1: "OperationCreateAccount",
  2: "OperationBid",
  3: "OperationAsk",
  4: "OperationTrade",
  5: "OperationTransfer",
  6: "OperationProof",
  10: "OperationCreateBlock",
  11: "OperationDataAvailability",
};

export interface MinaSignature {
  r: bigint;
  s: bigint;
}

export interface Token {
  suiAddress: string;
  minaPublicKey: string;
  minaPrivateKey?: string;
  tokenId: string;
  token: string;
  name: string;
  description: string;
  image: string;
}

export interface Pool {
  name: string;
  suiAddress: string;
  minaPublicKey: string;
  minaPrivateKey?: string;
  baseTokenId: string;
  quoteTokenId: string;
  lastPrice: bigint;
  accounts: Record<string, UserTradingAccount>;
}

export interface BlockStateRaw {
  id: string;
  name: string;
  block_number: number;
  sequence: number;
  accounts: any;
}

export interface BlockState {
  id: string;
  name: string;
  block_number: number;
  sequence: number;
  state: Record<string, UserTradingAccount>;
}

export interface Block {
  name: string;
  block_number: number;
  start_sequence: number;
  end_sequence: number;
  timestamp: number;
  time_since_last_block: number;
  number_of_transactions: number;
  start_action_state: number[];
  end_action_state: number[];
  state_data_availability: string | null;
  proof_data_availability: string | null;
  mina_tx_hash: string | null;
  mina_tx_included_in_block: boolean;
  block_state: {
    id: string;
    name: string;
    block_number: number;
    sequence: number;
    users: string[];
  };
}

export interface RawBlock {
  id: {
    id: string;
  };
  name: string;
  block_number: string;
  start_sequence: string;
  end_sequence: string;
  timestamp: string;
  time_since_last_block: string;
  number_of_transactions: string;
  start_action_state: number[];
  end_action_state: number[];
  state_data_availability: string | null;
  proof_data_availability: string | null;
  previous_block_address: string;
  mina_tx_hash: string | null;
  mina_tx_included_in_block: boolean;
  block_state: {
    fields: {
      name: string;
      block_number: string;
      sequence: string;
      users: string[];
      state: {
        fields: {
          id: {
            id: string;
          };
        };
      };
    };
  };
}

export interface BlockData {
  block: Block;
  state?: BlockState;
  events?: OperationEvent[];
}

export interface MinaBalance {
  amount: bigint;
  stakedAmount: bigint;
  borrowedAmount: bigint;
}

export interface Order {
  amount: bigint;
  price: bigint;
  isSome: boolean;
}

export interface UserTradingAccount {
  baseTokenBalance: MinaBalance;
  quoteTokenBalance: MinaBalance;
  bid: Order;
  ask: Order;
  nonce: bigint;
}

export interface SequenceState {
  sequence: bigint;
  state: Record<string, UserTradingAccount>;
}

export interface User {
  suiAddress: string;
  minaPublicKey: string;
  minaPrivateKey?: string;
  name: string;
  role: string;
  image: string;
  account: UserTradingAccount;
}

export interface DEXState {
  poolPublicKey: string;
  root: bigint;
  length: bigint;
  actionState: bigint;
  sequence: bigint;
  blockNumber: bigint;
}

export interface OperationData {
  operation: Operation;
  sequence: number;
  blockNumber: number;
  pool: string;
  poolPublicKey: string;
  actionState: number[];
  data: number[];
}

export interface ActionCreateAccount {
  address: string;
  poolPublicKey: string;
  publicKey: string;
  publicKeyBase58: string;
  name: string;
  role: string;
  image: string;
  baseBalance: bigint;
  quoteBalance: bigint;
}

export interface ActionProof {
  sequence: bigint;
  blockNumber: bigint;
  publicKeyBase58: string;
}

export interface ActionBid {
  userPublicKey: string;
  poolPublicKey: string;
  baseTokenAmount: bigint;
  price: bigint;
  isSome: boolean;
  nonce: bigint;
  userSignature: MinaSignature;
}

export interface ActionAsk {
  userPublicKey: string;
  poolPublicKey: string;
  baseTokenAmount: bigint;
  price: bigint;
  isSome: boolean;
  nonce: bigint;
  userSignature: MinaSignature;
}

export interface ActionTrade {
  buyerPublicKey: string;
  sellerPublicKey: string;
  poolPublicKey: string;
  baseTokenAmount: bigint;
  quoteTokenAmount: bigint;
  price: bigint;
  buyerNonce: bigint;
  sellerNonce: bigint;
}

export interface ActionTransfer {
  senderPublicKey: string;
  receiverPublicKey: string;
  baseTokenAmount: bigint;
  quoteTokenAmount: bigint;
  senderNonce: bigint;
  receiverNonce: bigint;
  senderSignature: MinaSignature;
}

export interface OperationEvent {
  type:
    | "OperationCreateAccountEvent"
    | "OperationBidEvent"
    | "OperationAskEvent"
    | "OperationTradeEvent"
    | "OperationTransferEvent";
  details:
    | ActionCreateAccount
    | ActionBid
    | ActionAsk
    | ActionTrade
    | ActionTransfer;
  operation: OperationData;
  timestamp: number;
}

export interface ActionCreateAccountRequest extends ActionCreateAccount {
  operation: Operation.CREATE_ACCOUNT;
}

export interface ActionBidRequest extends ActionBid {
  operation: Operation.BID;
}

export interface ActionAskRequest extends ActionAsk {
  operation: Operation.ASK;
}

export interface ActionTradeRequest extends ActionTrade {
  operation: Operation.TRADE;
}

export interface ActionTransferRequest extends ActionTransfer {
  operation: Operation.TRANSFER;
}

export interface ActionProofRequest extends ActionProof {
  operation: Operation.PROOF;
}

export type ActionRequest =
  | ActionCreateAccountRequest
  | ActionBidRequest
  | ActionAskRequest
  | ActionTradeRequest
  | ActionTransferRequest
  | ActionProofRequest;

export interface RawOperationEvent {
  type:
    | "OperationCreateAccountEvent"
    | "OperationBidEvent"
    | "OperationAskEvent"
    | "OperationTradeEvent"
    | "OperationTransferEvent";
  details: any;
  operation: {
    actionState: number[];
    data: number[];
    operation: number;
    pool: string;
    poolPublicKey: string;
    sequence: string;
    block_number: string;
  };
  timestamp: number;
}

export enum ProofStatus {
  STARTED = 1,
  CALCULATED = 2,
  REJECTED = 3,
  RESERVED = 4,
  USED = 5,
}

export const ProofStatusNames: { [key: number]: string } = {
  1: "STARTED",
  2: "CALCULATED",
  3: "REJECTED",
  4: "RESERVED",
  5: "USED",
};

export interface ProofStatusData {
  da_hash: string;
  status: ProofStatus;
  timestamp: number;
}

export interface BlockProofs {
  blockNumber: number;
  blockProof: string;
  startSequence: number;
  endSequence?: number;
  isFinished: boolean;
  proofs: { sequences: number[]; status: ProofStatusData }[];
}

export interface MergeProofRequest {
  blockNumber: number;
  proof1: { sequences: number[]; status: ProofStatusData };
  proof2: { sequences: number[]; status: ProofStatusData };
  status?: ProofStatus;
}

export interface ProofStatusData {
  da_hash: string;
  status: ProofStatus;
  timestamp: number;
}

export interface BlockProofs {
  blockNumber: number;
  blockProof: string;
  startSequence: number;
  endSequence?: number;
  isFinished: boolean;
  proofs: { sequences: number[]; status: ProofStatusData }[];
}

export interface MergeProofRequest {
  blockNumber: number;
  proof1: { sequences: number[]; status: ProofStatusData };
  proof2: { sequences: number[]; status: ProofStatusData };
  blockProof: boolean;
}

export type TransactionType =
  | "buy"
  | "sell"
  | "transfer"
  | "faucet"
  | "createAccount"
  | "proveAccount"
  | "stake"
  | "borrow"
  | "cancelBuy"
  | "cancelSell";

// export interface MinaBalance {
//   amount: bigint;
//   stakedAmount: bigint;
//   borrowedAmount: bigint;
//   pendingDeposits: bigint;
//   pendingWithdrawals: bigint;
// }

// export interface Order {
//   amount: bigint;
//   price: bigint;
//   isSome: boolean;
// }

export interface PendingTransaction {
  id: string;
  amount: bigint;
  currency: "WETH" | "WUSD";
  timestamp: number;
  confirmations: number;
  estimatedTimeRemaining: number;
}

// export interface UserTradingAccount {
//   baseTokenBalance: MinaBalance
//   quoteTokenBalance: MinaBalance
//   bid: Order
//   ask: Order
//   nonce: bigint
//   pendingDeposits: PendingTransaction[]
//   pendingWithdrawals: PendingTransaction[]
// }

export interface PendingTransactions {
  pendingDeposits: PendingTransaction[];
  pendingWithdrawals: PendingTransaction[];
}

export interface TransactionProof {
  id: number;
  proofCount: number;
  storageHash: string;
  time: string;
}

export interface TransactionError {
  code: string;
  message: string;
  severity: "warning" | "error";
}

export interface LastTransactionData {
  prepareTime: number;
  executeTime: number;
  indexTime?: number;
  minaTxHash?: string;
  digest: string;
  operationName: string;
  blockNumber: number;
  sequence: number;
  operation: number;
  proofs?: TransactionProof[];
  errors?: TransactionError[];
  blobId?: string;
}

export interface LastTransactionErrors {
  errors?: TransactionError[];
}

export interface NetworkInfoData {
  l1Settlement: string;
  minaChainId: string;
  minaContractAddress: string;
  minaCircuitDAHash: string;
  zkCoordination: string;
  suiAddress: string;
  dataAvailability: string;
  wallet: string;
  lastBlockNumber: number;
  lastProvedBlockNumber: number;
  sequence: number;
  circuitCreatedAt: string;
  circuitDescription: string;
  circuitId: string;
  circuitName: string;
  circuitPackageDaHash: string;
  circuitVerificationKeyData: string;
  circuitVerificationKeyHash: string;
}

export interface OrderFormState {
  orderType: TransactionType;
  amount?: string;
  price?: string;
  recipient: string;
  collateral: string;
  transferCurrency: "WETH" | "WUSD" | undefined;
  stakeCurrency: "WETH" | "WUSD" | undefined;
  borrowCurrency: "WETH" | "WUSD" | undefined;
}

export interface DexObject {
  actionsState: number[];
  admin: string;
  block_number: number;
  poolPublicKey: string;
  circuit: {
    type: string;
    fields: {
      created_at: string;
      description: string;
      id: { id: string };
      name: string;
      package_da_hash: string;
      verification_key_data: string;
      verification_key_hash: string;
    };
  };
  circuit_address: string;
  id: {
    id: string;
  };
  isPaused: boolean;
  last_proved_block_number: bigint;
  last_proved_sequence: bigint;
  name: string;
  pool: {
    type: string;
    fields: {
      accounts: {
        type: string;
        fields: { id: { id: string }; size: string };
      };
      base_token: {
        type: string;
        fields: {
          description: string;
          id: { id: string };
          image: string;
          name: string;
          publicKey: string;
          publicKeyBase58: string;
          token: string;
          tokenId: string;
        };
      };
      bids: {
        type: string;
        fields: { id: { id: string }; orders: any };
      };
      id: {
        id: string;
      };
      last_price: string;
      name: string;
      offers: {
        type: string;
        fields: { id: { id: string }; orders: any };
      };
      publicKey: string;
      publicKeyBase58: string;
      quote_token: {
        type: string;
        fields: {
          description: string;
          id: { id: string };
          image: string;
          name: string;
          publicKey: string;
          publicKeyBase58: string;
          token: string;
          tokenId: string;
        };
      };
      users: { type: string; fields: { contents: any[] } };
    };
  };
  bids: Record<
    string,
    {
      amount: bigint;
      price: bigint;
    }
  >;
  offers: Record<
    string,
    {
      amount: bigint;
      price: bigint;
    }
  >;
  users: string[];
  last_price: bigint;
  previous_block_actions_state: number[];
  previous_block_last_sequence: bigint;
  previous_block_timestamp: number;
  proof_calculations: {
    type: string;
    fields: any;
  };
  public_key: number[];
  sequence: bigint;
  version: number;
  dexObjectVersion: bigint;
}

export interface Orderbook {
  sorted_bids: Record<string, { amount: bigint; total: bigint }>;
  sorted_offers: Record<string, { amount: bigint; total: bigint }>;
  last_price: bigint;
  total_bid_amount: bigint;
  total_ask_amount: bigint;
  highest_bid?: bigint;
  lowest_offer?: bigint;
}

export interface Deal {
  sellerPublicKey: string;
  buyerPublicKey: string;
  baseTokenAmount: bigint;
  quoteTokenAmount: bigint;
}

export type RollupEventType =
  | "ProofStartedEvent"
  | "ProofSubmittedEvent"
  | "ProofUsedEvent"
  | "ProofReservedEvent"
  | "ProofReturnedEvent"
  | "ProofRejectedEvent"
  | "ProofCalculationCreatedEvent"
  | "BlockProofEvent"
  | "MinaTransactionEvent";

export type RollupEvent =
  | ProofStartedEvent
  | ProofSubmittedEvent
  | ProofUsedEvent
  | ProofReservedEvent
  | ProofReturnedEvent
  | ProofRejectedEvent
  | ProofCalculationCreatedEvent
  | BlockProofEvent
  | MinaTransactionEvent;

export interface EventBase {
  type: RollupEventType;
  digest: string;
  block_number: bigint;
  timestamp: number;
}

export interface ProofStartedEvent extends EventBase {
  type: "ProofStartedEvent";
  sequences: number[];
  prover: string;
}

export interface ProofSubmittedEvent extends EventBase {
  type: "ProofSubmittedEvent";
  sequences: number[];
  da_hash: string;
  prover: string;
  cpu_time: number;
  cpu_cores: number;
  prover_memory: bigint;
  prover_architecture: string;
}

export interface ProofUsedEvent extends EventBase {
  type: "ProofUsedEvent";
  sequences: number[];
  da_hash: string;
  user: string;
}

export interface ProofReservedEvent extends EventBase {
  type: "ProofReservedEvent";
  sequences: number[];
  da_hash: string;
  user: string;
}

export interface ProofReturnedEvent extends EventBase {
  type: "ProofReturnedEvent";
  sequences: number[];
  da_hash: string;
}

export interface ProofRejectedEvent extends EventBase {
  type: "ProofRejectedEvent";
  sequences: number[];
  da_hash: string;
  verifier: string;
}

export interface BlockProofEvent extends EventBase {
  type: "BlockProofEvent";
  start_sequence: bigint;
  end_sequence: bigint;
  da_hash: string;
}

export interface ProofCalculationCreatedEvent extends EventBase {
  type: "ProofCalculationCreatedEvent";
  start_sequence: bigint;
  end_sequence?: bigint;
  circuit: string;
}

export interface RawEvent {
  digest: string;
  type: string;
  data: any;
  timestamp: number;
}

export interface MinaTransactionEvent extends EventBase {
  type: "MinaTransactionEvent";
  start_sequence: bigint;
  end_sequence: bigint;
  state_data_availability: string;
  proof_data_availability: string | null;
  mina_tx_hash: string;
  mina_tx_included_in_block: boolean;
  sent_to_mina_at: number;
  settled_on_mina_at: number | null;
}

export interface ProofResultSubmission {
  type: "calculate proof" | "merge proofs" | "reject proof" | "verify proof";
  blockNumber: number;
  sequences: number[];
  mergedSequences1?: number[];
  mergedSequences2?: number[];
  dexID: string;
  da?: string;
  digest?: string;
}
