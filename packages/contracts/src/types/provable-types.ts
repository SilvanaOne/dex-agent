import {
  Field,
  PublicKey,
  Poseidon,
  Struct,
  Experimental,
  UInt64,
  Signature,
} from "o1js";
import {
  MinaBalance,
  UserTradingAccount,
  ActionCreateAccount,
  ActionBid,
  ActionAsk,
  ActionTrade,
  ActionTransfer,
  DEXState,
  Order,
  OperationData,
  OperationEvent,
  Block,
  BlockState,
} from "@dex-agent/lib";
import { IndexedMapSerialized } from "@silvana-one/storage";

export const DEX_HEIGHT = 10; // TODO: change to 20 in production
const IndexedMerkleMap = Experimental.IndexedMerkleMap;
type IndexedMerkleMap = Experimental.IndexedMerkleMap;

export class DEXMap extends IndexedMerkleMap(DEX_HEIGHT) {}

export class RollupDEXState extends Struct({
  poolPublicKey: PublicKey,
  root: Field,
  length: Field,
  actionState: Field, // TODO: check in production
  sequence: UInt64,
  blockNumber: UInt64,
}) {
  static assertEquals(a: RollupDEXState, b: RollupDEXState) {
    a.poolPublicKey.assertEquals(b.poolPublicKey);
    a.root.assertEquals(b.root);
    a.length.assertEquals(b.length);
    a.actionState.assertEquals(b.actionState);
    a.sequence.assertEquals(b.sequence);
    a.blockNumber.assertEquals(b.blockNumber);
  }

  static fromRollupData(rollupData: DEXState): RollupDEXState {
    return new RollupDEXState({
      poolPublicKey: PublicKey.fromBase58(rollupData.poolPublicKey),
      root: Field.from(rollupData.root),
      length: Field.from(rollupData.length),
      actionState: Field.from(rollupData.actionState),
      sequence: UInt64.from(rollupData.sequence),
      blockNumber: UInt64.from(rollupData.blockNumber),
    });
  }

  toRollupData(): DEXState {
    return {
      poolPublicKey: this.poolPublicKey.toBase58(),
      root: this.root.toBigInt(),
      length: this.length.toBigInt(),
      actionState: this.actionState.toBigInt(),
      sequence: this.sequence.toBigInt(),
      blockNumber: this.blockNumber.toBigInt(),
    } as DEXState;
  }
}

export class RollupMinaBalance extends Struct({
  amount: UInt64,
  stakedAmount: UInt64,
  borrowedAmount: UInt64,
}) {
  static fromAccountData(accountData: MinaBalance): RollupMinaBalance {
    return new RollupMinaBalance({
      amount: UInt64.from(accountData.amount),
      stakedAmount: UInt64.from(accountData.stakedAmount),
      borrowedAmount: UInt64.from(accountData.borrowedAmount),
    });
  }

  toAccountData(): MinaBalance {
    return {
      amount: this.amount.toBigInt(),
      stakedAmount: this.stakedAmount.toBigInt(),
      borrowedAmount: this.borrowedAmount.toBigInt(),
    } as MinaBalance;
  }
}

export class RollupOrder extends Struct({
  amount: UInt64,
  price: UInt64,
}) {
  static fromAccountData(accountData: Order): RollupOrder {
    return new RollupOrder({
      amount: UInt64.from(accountData.amount),
      price: UInt64.from(accountData.price),
    });
  }

  toAccountData(): Order {
    const amount = this.amount.toBigInt();
    const price = this.price.toBigInt();
    const isSome = amount > 0n && price > 0n;
    return {
      amount,
      price,
      isSome,
    } as Order;
  }
}
export class RollupUserTradingAccount extends Struct({
  baseTokenBalance: RollupMinaBalance,
  quoteTokenBalance: RollupMinaBalance,
  bid: RollupOrder,
  ask: RollupOrder,
  nonce: UInt64,
}) {
  hash(): Field {
    return Poseidon.hashPacked(RollupUserTradingAccount, this);
  }

  static fromAccountData(
    accountData: UserTradingAccount
  ): RollupUserTradingAccount {
    return new RollupUserTradingAccount({
      baseTokenBalance: RollupMinaBalance.fromAccountData(
        accountData.baseTokenBalance
      ),
      quoteTokenBalance: RollupMinaBalance.fromAccountData(
        accountData.quoteTokenBalance
      ),
      bid: RollupOrder.fromAccountData(accountData.bid),
      ask: RollupOrder.fromAccountData(accountData.ask),
      nonce: UInt64.from(accountData.nonce),
    });
  }

  toAccountData(): UserTradingAccount {
    return {
      baseTokenBalance: this.baseTokenBalance.toAccountData(),
      quoteTokenBalance: this.quoteTokenBalance.toAccountData(),
      bid: this.bid.toAccountData(),
      ask: this.ask.toAccountData(),
      nonce: this.nonce.toBigInt(),
    } as UserTradingAccount;
  }
}

/*

export interface ActionCreateAccount {
  address: string;
  publicKey: string;
  publicKeyBase58: string;
  name: string;
  role: string;
  image: string;
  baseBalance: bigint;
  quoteBalance: bigint;
}
  */

export class RollupActionCreateAccount extends Struct({
  publicKey: PublicKey,
  baseBalance: UInt64, // TODO: remove in production
  quoteBalance: UInt64, // TODO: remove in production
}) {
  static fromAction(action: ActionCreateAccount): RollupActionCreateAccount {
    return new RollupActionCreateAccount({
      publicKey: PublicKey.fromBase58(action.publicKeyBase58),
      baseBalance: UInt64.from(action.baseBalance),
      quoteBalance: UInt64.from(action.quoteBalance),
    });
  }
}

/*
export interface ActionBid {
  userPublicKey: string;
  poolPublicKey: string;
  amount: bigint;
  price: bigint;
  isSome: boolean;
  nonce: number;
  userSignature: MinaSignature;
}
*/

export class RollupActionBid extends Struct({
  userPublicKey: PublicKey,
  baseTokenAmount: UInt64,
  price: UInt64,
  nonce: UInt64,
  userSignature: Signature,
}) {
  static fromAction(action: ActionBid): RollupActionBid {
    return new RollupActionBid({
      userPublicKey: PublicKey.fromBase58(action.userPublicKey),
      baseTokenAmount: UInt64.from(action.baseTokenAmount),
      price: UInt64.from(action.price),
      nonce: UInt64.from(action.nonce),
      userSignature: Signature.fromValue(action.userSignature),
    });
  }
}

/*
export interface ActionAsk {
  userPublicKey: string;
  poolPublicKey: string;
  amount: bigint;
  price: bigint;
  isSome: boolean;
  nonce: number;
  userSignature: MinaSignature;
}
*/

export class RollupActionAsk extends Struct({
  userPublicKey: PublicKey,
  baseTokenAmount: UInt64,
  price: UInt64,
  nonce: UInt64,
  userSignature: Signature,
}) {
  static fromAction(action: ActionAsk): RollupActionAsk {
    return new RollupActionAsk({
      userPublicKey: PublicKey.fromBase58(action.userPublicKey),
      baseTokenAmount: UInt64.from(action.baseTokenAmount),
      price: UInt64.from(action.price),
      nonce: UInt64.from(action.nonce),
      userSignature: Signature.fromValue(action.userSignature),
    });
  }
}

/*
export interface ActionTrade {
  buyerPublicKey: string;
  sellerPublicKey: string;
  poolPublicKey: string;
  amount: bigint;
  quoteAmount: bigint;
  price: bigint;
  buyerNonce: number;
  sellerNonce: number;
}

*/

export class RollupActionTrade extends Struct({
  buyerPublicKey: PublicKey,
  sellerPublicKey: PublicKey,
  baseTokenAmount: UInt64,
  quoteTokenAmount: UInt64,
}) {
  static fromAction(action: ActionTrade): RollupActionTrade {
    return new RollupActionTrade({
      buyerPublicKey: PublicKey.fromBase58(action.buyerPublicKey),
      sellerPublicKey: PublicKey.fromBase58(action.sellerPublicKey),
      baseTokenAmount: UInt64.from(action.baseTokenAmount),
      quoteTokenAmount: UInt64.from(action.quoteTokenAmount),
    });
  }
}

/*

export interface ActionTransferBaseToken {
  senderPublicKey: string;
  receiverPublicKey: string;
  amount: bigint;
  senderNonce: number;
  receiverNonce: number;
  senderSignature: MinaSignature;
}
  */

export class RollupActionTransfer extends Struct({
  senderPublicKey: PublicKey,
  receiverPublicKey: PublicKey,
  baseTokenAmount: UInt64,
  quoteTokenAmount: UInt64,
  senderNonce: UInt64,
  senderSignature: Signature,
}) {
  static fromAction(action: ActionTransfer): RollupActionTransfer {
    return new RollupActionTransfer({
      senderPublicKey: PublicKey.fromBase58(action.senderPublicKey),
      receiverPublicKey: PublicKey.fromBase58(action.receiverPublicKey),
      baseTokenAmount: UInt64.from(action.baseTokenAmount),
      quoteTokenAmount: UInt64.from(action.quoteTokenAmount),
      senderNonce: UInt64.from(action.senderNonce),
      senderSignature: Signature.fromValue(action.senderSignature),
    });
  }
}

export class AccountAuxiliaryOutput extends Struct({
  map: DEXMap,
  account: RollupUserTradingAccount,
}) {}

export class TradeAuxiliaryOutput extends Struct({
  map: DEXMap,
  buyer: RollupUserTradingAccount,
  seller: RollupUserTradingAccount,
}) {}

export class TransferAuxiliaryOutput extends Struct({
  map: DEXMap,
  sender: RollupUserTradingAccount,
  receiver: RollupUserTradingAccount,
}) {}

export interface SequenceData {
  sequence: number;
  blockNumber: number;
  operation: OperationData;
  map: IndexedMapSerialized;
}

export class ProvableBlockData {
  block: Block;
  state: BlockState;
  events: OperationEvent[];
  map: IndexedMapSerialized;

  constructor(params: {
    block: Block;
    state: BlockState;
    events: OperationEvent[];
    map: IndexedMapSerialized;
  }) {
    this.block = params.block;
    this.state = params.state;
    this.events = params.events;
    this.map = params.map;
  }

  serialize(): string {
    return JSON.stringify(
      this,
      (_, value) =>
        typeof value === "bigint" ? value.toString() + "n" : value,
      2
    );
  }

  static deserialize(json: string): ProvableBlockData {
    const data = JSON.parse(json, (key, value) =>
      typeof value === "string" &&
      value.endsWith("n") &&
      key !== "proof" &&
      !value.startsWith("B62")
        ? BigInt(value.slice(0, -1))
        : value
    );
    return new ProvableBlockData({
      block: data.block,
      state: data.state,
      events: data.events,
      map: data.map,
    });
  }
}
