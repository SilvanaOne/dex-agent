import {
  ZkProgram,
  PublicKey,
  Poseidon,
  UInt64,
  Field,
  Bool,
  SelfProof,
  JsonProof,
  Provable,
} from "o1js";
import {
  RollupDEXState,
  DEXMap,
  RollupActionCreateAccount,
  RollupActionBid,
  RollupActionAsk,
  RollupActionTrade,
  RollupActionTransfer,
  RollupUserTradingAccount,
  RollupMinaBalance,
  RollupOrder,
  AccountAuxiliaryOutput,
  TradeAuxiliaryOutput,
  TransferAuxiliaryOutput,
} from "../types/provable-types.js";
import { mulDiv } from "../util/div.js";
import { Operation, UserTradingAccount } from "@dex-agent/lib";
import { getMinaSignatureData } from "../signature.js";
import {
  serializeIndexedMap,
  deserializeIndexedMerkleMap,
} from "@silvana-one/storage";

export const DEXProgram = ZkProgram({
  name: "DEXProgram",
  publicInput: RollupDEXState,
  publicOutput: RollupDEXState,
  methods: {
    createAccount: {
      privateInputs: [DEXMap, RollupActionCreateAccount],
      auxiliaryOutput: AccountAuxiliaryOutput,
      async method(
        input: RollupDEXState,
        map: DEXMap,
        action: RollupActionCreateAccount
      ): Promise<{
        publicOutput: RollupDEXState;
        auxiliaryOutput: AccountAuxiliaryOutput;
      }> {
        map.root.assertEquals(input.root);
        map.length.assertEquals(input.length);
        const key = Poseidon.hashPacked(PublicKey, action.publicKey);
        const account = new RollupUserTradingAccount({
          baseTokenBalance: new RollupMinaBalance({
            amount: action.baseBalance,
            stakedAmount: UInt64.zero,
            borrowedAmount: UInt64.zero,
          }),
          quoteTokenBalance: new RollupMinaBalance({
            amount: action.quoteBalance,
            stakedAmount: UInt64.zero,
            borrowedAmount: UInt64.zero,
          }),
          bid: new RollupOrder({
            amount: UInt64.zero,
            price: UInt64.zero,
          }),
          ask: new RollupOrder({
            amount: UInt64.zero,
            price: UInt64.zero,
          }),
          nonce: UInt64.zero,
        });

        map.set(key, account.hash());

        return {
          publicOutput: new RollupDEXState({
            poolPublicKey: input.poolPublicKey,
            root: map.root,
            length: map.length,
            actionState: input.actionState,
            sequence: input.sequence.add(1),
            blockNumber: input.blockNumber,
          }),
          auxiliaryOutput: new AccountAuxiliaryOutput({ map, account }),
        };
      },
    },

    bid: {
      privateInputs: [DEXMap, RollupActionBid, RollupUserTradingAccount],
      auxiliaryOutput: AccountAuxiliaryOutput,
      async method(
        input: RollupDEXState,
        map: DEXMap,
        action: RollupActionBid,
        account: RollupUserTradingAccount
      ): Promise<{
        publicOutput: RollupDEXState;
        auxiliaryOutput: AccountAuxiliaryOutput;
      }> {
        map.root.assertEquals(input.root);
        map.length.assertEquals(input.length);
        const key = Poseidon.hashPacked(PublicKey, action.userPublicKey);
        const value = map.get(key);
        value.assertEquals(account.hash());
        const quoteAmount = mulDiv({
          value: action.baseTokenAmount,
          multiplier: action.price,
          denominator: UInt64.from(1_000_000_000),
        }).result;
        account.quoteTokenBalance.amount.assertGreaterThanOrEqual(quoteAmount);
        action.userSignature
          .verify(
            action.userPublicKey,
            getMinaSignatureData({
              poolPublicKey: input.poolPublicKey,
              operation: Operation.BID,
              nonce: action.nonce,
              baseTokenAmount: action.baseTokenAmount,
              price: action.price,
            })
          )
          .assertTrue();
        account.bid.amount = action.baseTokenAmount;
        account.bid.price = action.price;
        account.nonce = account.nonce.add(1);
        map.set(key, account.hash());

        return {
          publicOutput: new RollupDEXState({
            poolPublicKey: input.poolPublicKey,
            root: map.root,
            length: map.length,
            actionState: input.actionState,
            sequence: input.sequence.add(1),
            blockNumber: input.blockNumber,
          }),
          auxiliaryOutput: new AccountAuxiliaryOutput({ map, account }),
        };
      },
    },

    ask: {
      privateInputs: [DEXMap, RollupActionAsk, RollupUserTradingAccount],
      auxiliaryOutput: AccountAuxiliaryOutput,
      async method(
        input: RollupDEXState,
        map: DEXMap,
        action: RollupActionAsk,
        account: RollupUserTradingAccount
      ): Promise<{
        publicOutput: RollupDEXState;
        auxiliaryOutput: AccountAuxiliaryOutput;
      }> {
        map.root.assertEquals(input.root);
        map.length.assertEquals(input.length);
        const key = Poseidon.hashPacked(PublicKey, action.userPublicKey);
        const value = map.get(key);
        value.assertEquals(account.hash());
        account.baseTokenBalance.amount.assertGreaterThanOrEqual(
          action.baseTokenAmount
        );
        action.userSignature
          .verify(
            action.userPublicKey,
            getMinaSignatureData({
              poolPublicKey: input.poolPublicKey,
              operation: Operation.ASK,
              nonce: action.nonce,
              baseTokenAmount: action.baseTokenAmount,
              price: action.price,
            })
          )
          .assertTrue();
        account.ask.amount = action.baseTokenAmount;
        account.ask.price = action.price;
        account.nonce = account.nonce.add(1);
        map.set(key, account.hash());

        return {
          publicOutput: new RollupDEXState({
            poolPublicKey: input.poolPublicKey,
            root: map.root,
            length: map.length,
            actionState: input.actionState,
            sequence: input.sequence.add(1),
            blockNumber: input.blockNumber,
          }),
          auxiliaryOutput: new AccountAuxiliaryOutput({ map, account }),
        };
      },
    },

    trade: {
      privateInputs: [
        DEXMap,
        RollupActionTrade,
        RollupUserTradingAccount,
        RollupUserTradingAccount,
      ],
      auxiliaryOutput: TradeAuxiliaryOutput,
      async method(
        input: RollupDEXState,
        map: DEXMap,
        action: RollupActionTrade,
        buyer: RollupUserTradingAccount,
        seller: RollupUserTradingAccount
      ): Promise<{
        publicOutput: RollupDEXState;
        auxiliaryOutput: TradeAuxiliaryOutput;
      }> {
        action.baseTokenAmount
          .equals(UInt64.zero)
          .assertFalse("amount is zero");
        action.quoteTokenAmount
          .equals(UInt64.zero)
          .assertFalse("price is zero");

        map.root.assertEquals(input.root);
        map.length.assertEquals(input.length);
        const buyerKey = Poseidon.hashPacked(PublicKey, action.buyerPublicKey);
        const sellerKey = Poseidon.hashPacked(
          PublicKey,
          action.sellerPublicKey
        );
        const buyerValue = map.get(buyerKey);
        buyerValue.assertEquals(buyer.hash());
        const sellerValue = map.get(sellerKey);
        sellerValue.assertEquals(seller.hash());

        buyer.quoteTokenBalance.amount.assertGreaterThanOrEqual(
          action.quoteTokenAmount
        );
        seller.baseTokenBalance.amount.assertGreaterThanOrEqual(
          action.baseTokenAmount
        );

        // Check buyer bid validity
        buyer.bid.amount.assertGreaterThanOrEqual(action.baseTokenAmount);
        buyer.bid.price.value
          .mul(action.baseTokenAmount.value)
          .assertGreaterThanOrEqual(
            action.quoteTokenAmount.value.mul(1_000_000_000n)
          );

        seller.ask.price.value
          .mul(action.baseTokenAmount.value)
          .assertLessThanOrEqual(
            action.quoteTokenAmount.value.mul(1_000_000_000n)
          );

        // Update buyer balances
        buyer.bid.amount = buyer.bid.amount.sub(action.baseTokenAmount);
        buyer.baseTokenBalance.amount = buyer.baseTokenBalance.amount.add(
          action.baseTokenAmount
        );
        buyer.quoteTokenBalance.amount = buyer.quoteTokenBalance.amount.sub(
          action.quoteTokenAmount
        );

        // Update seller balances
        seller.ask.amount = seller.ask.amount.sub(action.baseTokenAmount);
        seller.baseTokenBalance.amount = seller.baseTokenBalance.amount.sub(
          action.baseTokenAmount
        );
        seller.quoteTokenBalance.amount = seller.quoteTokenBalance.amount.add(
          action.quoteTokenAmount
        );

        map.set(buyerKey, buyer.hash());
        map.set(sellerKey, seller.hash());

        return {
          publicOutput: new RollupDEXState({
            poolPublicKey: input.poolPublicKey,
            root: map.root,
            length: map.length,
            actionState: input.actionState,
            sequence: input.sequence.add(1),
            blockNumber: input.blockNumber,
          }),
          auxiliaryOutput: new TradeAuxiliaryOutput({ map, buyer, seller }),
        };
      },
    },

    transfer: {
      privateInputs: [
        DEXMap,
        RollupActionTransfer,
        RollupUserTradingAccount,
        RollupUserTradingAccount,
      ],
      auxiliaryOutput: TransferAuxiliaryOutput,
      async method(
        input: RollupDEXState,
        map: DEXMap,
        action: RollupActionTransfer,
        sender: RollupUserTradingAccount,
        receiver: RollupUserTradingAccount
      ): Promise<{
        publicOutput: RollupDEXState;
        auxiliaryOutput: TransferAuxiliaryOutput;
      }> {
        action.baseTokenAmount
          .equals(UInt64.zero)
          .and(action.quoteTokenAmount.equals(UInt64.zero))
          .assertFalse("amount is zero");

        map.root.assertEquals(input.root);
        map.length.assertEquals(input.length);
        const senderKey = Poseidon.hashPacked(
          PublicKey,
          action.senderPublicKey
        );
        const receiverKey = Poseidon.hashPacked(
          PublicKey,
          action.receiverPublicKey
        );
        const senderValue = map.get(senderKey);
        const senderHash = sender.hash();
        senderValue.assertEquals(senderHash);
        const receiverValue = map.get(receiverKey);
        const receiverHash = receiver.hash();
        receiverValue.assertEquals(receiverHash);

        // Verify sender has sufficient balance and no borrowed amounts
        sender.baseTokenBalance.amount.assertGreaterThanOrEqual(
          action.baseTokenAmount,
          "insufficient base token sender balance"
        );
        sender.quoteTokenBalance.amount.assertGreaterThanOrEqual(
          action.quoteTokenAmount,
          "insufficient quote token sender balance"
        );
        sender.baseTokenBalance.borrowedAmount
          .equals(UInt64.zero)
          .assertTrue("cannot transfer borrowed amount");
        sender.quoteTokenBalance.borrowedAmount
          .equals(UInt64.zero)
          .assertTrue("cannot transfer borrowed amount");

        // Verify signature
        const signatureData = getMinaSignatureData({
          poolPublicKey: input.poolPublicKey,
          operation: Operation.TRANSFER,
          nonce: action.senderNonce,
          baseTokenAmount: action.baseTokenAmount,
          quoteTokenAmount: action.quoteTokenAmount,
          receiverPublicKey: action.receiverPublicKey,
        });
        action.senderSignature
          .verify(action.senderPublicKey, signatureData)
          .assertTrue();

        // Update sender balance
        sender.baseTokenBalance.amount = sender.baseTokenBalance.amount.sub(
          action.baseTokenAmount
        );
        sender.quoteTokenBalance.amount = sender.quoteTokenBalance.amount.sub(
          action.quoteTokenAmount
        );
        sender.nonce = sender.nonce.add(1);

        // Update receiver balance
        receiver.baseTokenBalance.amount = receiver.baseTokenBalance.amount.add(
          action.baseTokenAmount
        );
        receiver.quoteTokenBalance.amount =
          receiver.quoteTokenBalance.amount.add(action.quoteTokenAmount);

        map.set(senderKey, sender.hash());
        map.set(receiverKey, receiver.hash());

        return {
          publicOutput: new RollupDEXState({
            poolPublicKey: input.poolPublicKey,
            root: map.root,
            length: map.length,
            actionState: input.actionState,
            sequence: input.sequence.add(1),
            blockNumber: input.blockNumber,
          }),
          auxiliaryOutput: new TransferAuxiliaryOutput({
            map,
            sender,
            receiver,
          }),
        };
      },
    },

    merge: {
      privateInputs: [SelfProof, SelfProof],
      async method(
        input: RollupDEXState,
        proof1: SelfProof<RollupDEXState, RollupDEXState>,
        proof2: SelfProof<RollupDEXState, RollupDEXState>
      ) {
        proof1.verify();
        proof2.verify();
        RollupDEXState.assertEquals(input, proof1.publicInput);
        RollupDEXState.assertEquals(proof1.publicOutput, proof2.publicInput);
        return {
          publicOutput: proof2.publicOutput,
        };
      },
    },
  },
});

export class DEXProof extends ZkProgram.Proof(DEXProgram) {}

export const DEXAccountProofProgram = ZkProgram({
  name: "DEXAccountProofProgram",
  publicInput: RollupDEXState,
  publicOutput: RollupUserTradingAccount,
  methods: {
    proveState: {
      privateInputs: [DEXMap, PublicKey, RollupUserTradingAccount],
      async method(
        input: RollupDEXState,
        map: DEXMap,
        address: PublicKey,
        account: RollupUserTradingAccount
      ): Promise<{
        publicOutput: RollupUserTradingAccount;
      }> {
        map.root.assertEquals(input.root);
        map.length.assertEquals(input.length);
        const key = Poseidon.hashPacked(PublicKey, address);
        const value = map.get(key);
        value.assertEquals(account.hash());

        return {
          publicOutput: account,
        };
      },
    },
  },
});

export class DEXAccountProof extends ZkProgram.Proof(DEXAccountProofProgram) {}

const stateType = "SequenceStateV1";

export class SequenceState {
  poolPublicKey: string;
  blockNumber: number;
  sequences: number[];
  dexState: RollupDEXState;
  map: DEXMap;
  accounts: Record<string, RollupUserTradingAccount>;
  dexProof?: DEXProof;

  constructor(params: {
    poolPublicKey: string;
    blockNumber: number;
    sequences: number[];
    dexState: RollupDEXState;
    map: DEXMap;
    accounts: Record<string, RollupUserTradingAccount>;
    dexProof?: DEXProof;
  }) {
    this.poolPublicKey = params.poolPublicKey;
    this.blockNumber = params.blockNumber;
    this.sequences = params.sequences;
    this.dexState = params.dexState;
    this.map = params.map;
    this.accounts = params.accounts;
    this.dexProof = params.dexProof;
  }

  toJSON(): string {
    return JSON.stringify(
      {
        type: stateType,
        poolPublicKey: this.poolPublicKey,
        blockNumber: this.blockNumber,
        sequences: this.sequences,
        dexState: this.dexState.toRollupData(),
        map: serializeIndexedMap(this.map),
        accounts: Object.entries(this.accounts).map(([key, value]) => ({
          key,
          value: value.toAccountData(),
        })),
        dexProof: this.dexProof?.toJSON(),
      },
      (_, value) =>
        typeof value === "bigint" ? value.toString() + "n" : value,
      2
    );
  }

  static async fromJSON(str: string): Promise<SequenceState> {
    const data = JSON.parse(str, (key, value) =>
      typeof value === "string" &&
      value.endsWith("n") &&
      key !== "proof" &&
      !value.startsWith("B62")
        ? BigInt(value.slice(0, -1))
        : value
    );
    if (data.type !== stateType) {
      throw new Error("Invalid type");
    }
    const dexProof: DEXProof | undefined = data.dexProof
      ? ((await DEXProof.fromJSON(data.dexProof as JsonProof)) as DEXProof)
      : undefined;
    return new SequenceState({
      poolPublicKey: data.poolPublicKey,
      blockNumber: data.blockNumber,
      sequences: data.sequences,
      dexState: RollupDEXState.fromRollupData(data.dexState),
      map: deserializeIndexedMerkleMap({
        serializedIndexedMap: data.map,
        type: DEXMap,
      }) as DEXMap,
      accounts: Object.fromEntries(
        data.accounts.map(
          (account: { key: string; value: UserTradingAccount }) => [
            account.key,
            RollupUserTradingAccount.fromAccountData(account.value),
          ]
        )
      ),
      dexProof,
    });
  }
}
