import { describe, it } from "node:test";
import assert from "node:assert";
import {
  UInt32,
  Bool,
  UInt64,
  PrivateKey,
  PublicKey,
  Field,
  Struct,
  ZkProgram,
  Gadgets,
  Provable,
  Cache,
  Signature,
  VerificationKey,
  verify,
  Mina,
  AccountUpdate,
  JsonProof,
} from "o1js";
import { DEXProgram, DEXProof } from "@dex-agent/contracts";
import { DEXContract } from "@dex-agent/contracts";
import {
  Operation,
  ActionCreateAccount,
  ActionAsk,
  ActionBid,
  ActionTransfer,
  ActionTrade,
} from "@dex-agent/lib";
import {
  RollupActionCreateAccount,
  RollupActionAsk,
  RollupActionBid,
  RollupActionTransfer,
  RollupActionTrade,
  DEXMap,
  RollupDEXState,
  RollupUserTradingAccount,
  RollupOrder,
  RollupMinaBalance,
} from "@dex-agent/contracts";
import {
  fetchMinaAccount,
  initBlockchain,
  accountBalanceMina,
  Memory,
  sendTx,
  pinJSON,
} from "@silvana-one/mina-utils";
import { signDexFields } from "@dex-agent/lib";
import { TEST_ACCOUNTS } from "./helpers/config.js";

const { TestPublicKey } = Mina;
type TestPublicKey = Mina.TestPublicKey;

let blockProof: string | null = null;

const chain = process.env.MINA_CHAIN! as
  | "local"
  | "devnet"
  | "zeko"
  | "mainnet";
if (
  chain !== "local" &&
  chain !== "devnet" &&
  chain !== "zeko" &&
  chain !== "mainnet"
) {
  throw new Error(`Invalid chain: ${chain}`);
}
const expectedTxStatus = chain === "zeko" ? "pending" : "included";

const NUMBER_OF_USERS = 2;
let admin: TestPublicKey;

function getUser() {
  const privateKey = PrivateKey.random();
  return {
    publicKey: privateKey.toPublicKey(),
    privateKey,
  };
}

let vk: VerificationKey | null = null;
let vkContract: VerificationKey | null = null;
const poolKey = TestPublicKey.random();
const poolPublicKey = poolKey;
const dex = new DEXContract(poolKey);
const faucetBaseTokenAmount = 1_000_000_000n;
const faucetQuoteTokenAmount = 2_000_000_000_000n;
const tradeBaseTokenAmount = 1_000_000_000n;
const tradeQuoteTokenAmount = 2_000_000_000_000n;
const tradePrice = 2_000_000_000_000n;
const users: {
  [key: string]: {
    publicKey: PublicKey;
    privateKey: PrivateKey;
  };
} = {
  alice: getUser(),
  bob: getUser(),
  faucet: getUser(),
};

const operations: {
  operation: Operation;
  action:
    | ActionCreateAccount
    | ActionAsk
    | ActionBid
    | ActionTransfer
    | ActionTrade;
}[] = [
  {
    operation: Operation.CREATE_ACCOUNT,
    action: {
      poolPublicKey: poolPublicKey.toBase58(),
      publicKey: users.faucet.publicKey.toBase58(),
      baseBalance: 1_000_000_000_000n,
      quoteBalance: 2_000_000_000_000_000n,
      nonce: 0n,
      address: "",
      publicKeyBase58: users.faucet.publicKey.toBase58(),
      name: "Faucet",
      role: "faucet",
      image: "",
    } as ActionCreateAccount,
  },
  {
    operation: Operation.CREATE_ACCOUNT,
    action: {
      poolPublicKey: poolPublicKey.toBase58(),
      publicKey: users.alice.publicKey.toBase58(),
      baseBalance: 0n,
      quoteBalance: 0n,
      nonce: 0n,
      address: "",
      publicKeyBase58: users.alice.publicKey.toBase58(),
      name: "Alice",
      role: "user",
      image: "",
    } as ActionCreateAccount,
  },
  {
    operation: Operation.CREATE_ACCOUNT,
    action: {
      poolPublicKey: poolPublicKey.toBase58(),
      publicKey: users.bob.publicKey.toBase58(),
      baseBalance: 0n,
      quoteBalance: 0n,
      nonce: 0n,
      address: "",
      publicKeyBase58: users.bob.publicKey.toBase58(),
      name: "Bob",
      role: "user",
      image: "",
    } as ActionCreateAccount,
  },
  {
    operation: Operation.TRANSFER,
    action: {
      senderPublicKey: users.faucet.publicKey.toBase58(),
      receiverPublicKey: users.alice.publicKey.toBase58(),
      baseTokenAmount: faucetBaseTokenAmount,
      quoteTokenAmount: faucetQuoteTokenAmount,
      senderNonce: 0n,
      receiverNonce: 0n,
      senderSignature: (
        await signDexFields({
          poolPublicKey: poolPublicKey.toBase58(),
          minaPrivateKey: users.faucet.privateKey.toBase58(),
          operation: Operation.TRANSFER,
          nonce: 0n,
          baseTokenAmount: faucetBaseTokenAmount,
          quoteTokenAmount: faucetQuoteTokenAmount,
          receiverPublicKey: users.alice.publicKey.toBase58(),
        })
      ).minaSignature,
    } as ActionTransfer,
  },
  {
    operation: Operation.TRANSFER,
    action: {
      senderPublicKey: users.faucet.publicKey.toBase58(),
      receiverPublicKey: users.bob.publicKey.toBase58(),
      baseTokenAmount: faucetBaseTokenAmount,
      quoteTokenAmount: faucetQuoteTokenAmount,
      senderNonce: 1n,
      receiverNonce: 0n,
      senderSignature: (
        await signDexFields({
          poolPublicKey: poolPublicKey.toBase58(),
          minaPrivateKey: users.faucet.privateKey.toBase58(),
          operation: Operation.TRANSFER,
          nonce: 1n,
          baseTokenAmount: faucetBaseTokenAmount,
          quoteTokenAmount: faucetQuoteTokenAmount,
          receiverPublicKey: users.bob.publicKey.toBase58(),
        })
      ).minaSignature,
    } as ActionTransfer,
  },
  {
    operation: Operation.ASK,
    action: {
      userPublicKey: users.alice.publicKey.toBase58(),
      poolPublicKey: poolPublicKey.toBase58(),
      baseTokenAmount: tradeBaseTokenAmount,
      price: tradePrice,
      isSome: true,
      nonce: 1n,
      userSignature: (
        await signDexFields({
          poolPublicKey: poolPublicKey.toBase58(),
          minaPrivateKey: users.alice.privateKey.toBase58(),
          operation: Operation.ASK,
          nonce: 1n,
          baseTokenAmount: tradeBaseTokenAmount,
          price: tradePrice,
        })
      ).minaSignature,
    } as ActionAsk,
  },
  {
    operation: Operation.BID,
    action: {
      userPublicKey: users.bob.publicKey.toBase58(),
      poolPublicKey: poolPublicKey.toBase58(),
      baseTokenAmount: tradeBaseTokenAmount,
      price: tradePrice,
      isSome: true,
      nonce: 1n,
      userSignature: (
        await signDexFields({
          poolPublicKey: poolPublicKey.toBase58(),
          minaPrivateKey: users.bob.privateKey.toBase58(),
          operation: Operation.BID,
          nonce: 1n,
          baseTokenAmount: tradeBaseTokenAmount,
          price: tradePrice,
        })
      ).minaSignature,
    } as ActionBid,
  },
  {
    operation: Operation.TRADE,
    action: {
      buyerPublicKey: users.bob.publicKey.toBase58(),
      sellerPublicKey: users.alice.publicKey.toBase58(),
      poolPublicKey: poolPublicKey.toBase58(),
      baseTokenAmount: tradeBaseTokenAmount,
      quoteTokenAmount: tradeQuoteTokenAmount,
      price: tradePrice,
      buyerNonce: 2n,
      sellerNonce: 2n,
    } as ActionTrade,
  },
];

function convertActionToRollupAction(params: {
  operation: Operation;
  action:
    | ActionCreateAccount
    | ActionAsk
    | ActionBid
    | ActionTransfer
    | ActionTrade;
}):
  | RollupActionCreateAccount
  | RollupActionAsk
  | RollupActionBid
  | RollupActionTransfer
  | RollupActionTrade {
  const { action, operation } = params;
  switch (operation) {
    case Operation.CREATE_ACCOUNT:
      return RollupActionCreateAccount.fromAction(
        action as ActionCreateAccount
      );
    case Operation.ASK:
      return RollupActionAsk.fromAction(action as ActionAsk);
    case Operation.BID:
      return RollupActionBid.fromAction(action as ActionBid);
    case Operation.TRANSFER:
      return RollupActionTransfer.fromAction(action as ActionTransfer);
    case Operation.TRADE:
      return RollupActionTrade.fromAction(action as ActionTrade);
    default:
      throw new Error(
        `convertActionToRollupAction: Unsupported operation: ${operation}`
      );
  }
}

const fieldOperations: {
  operation: Operation;
  action:
    | RollupActionCreateAccount
    | RollupActionAsk
    | RollupActionBid
    | RollupActionTransfer
    | RollupActionTrade;
}[] = operations.map((item) => ({
  operation: item.operation,
  action: convertActionToRollupAction({
    operation: item.operation,
    action: item.action,
  }),
}));

const proofs: DEXProof[] = [];
const mergeJobs: number[][] = [
  [0, 1],
  [2, 3],
  [4, 5],
  [6, 7],
  [8, 9],
  [10, 11],
  [12, 13],
];
const newMap = new DEXMap();
const maps: DEXMap[] = [newMap];
let dexState = new RollupDEXState({
  poolPublicKey: poolPublicKey,
  root: maps[0].root,
  length: maps[0].length,
  actionState: Field(0),
  sequence: UInt64.from(0),
  blockNumber: UInt64.from(0),
});

describe("Circuits", async () => {
  it("should initialize a blockchain", async () => {
    if (chain === "devnet" || chain === "zeko" || chain === "mainnet") {
      await initBlockchain(chain);
      admin = TestPublicKey.fromBase58(TEST_ACCOUNTS[0].privateKey);
      // users = TEST_ACCOUNTS.slice(1).map((account) =>
      //   TestPublicKey.fromBase58(account.privateKey)
      // );
    } else if (chain === "local") {
      const { keys } = await initBlockchain(chain, NUMBER_OF_USERS + 2);
      admin = TestPublicKey(keys[1].key);
      // users = keys.slice(2);
    } else if (chain === "lightnet") {
      const { keys } = await initBlockchain(chain, NUMBER_OF_USERS + 2);

      admin = TestPublicKey(keys[1].key);
      // users = keys.slice(2);
    }
    // assert(users.length >= NUMBER_OF_USERS);
    console.log("chain:", chain);
    console.log("networkId:", Mina.getNetworkId());

    console.log("DEX contract address:", poolPublicKey.toBase58());

    console.log(
      "Admin",
      admin.toBase58(),
      "balance:",
      await accountBalanceMina(admin)
    );
    // for (let i = 0; i < NUMBER_OF_USERS; i++) {
    //   console.log(
    //     `User ${i} `,
    //     users[i].publicKey.toBase58(),
    //     "balance:",
    //     await accountBalanceMina(users[i])
    //   );
    // }
    Memory.info("before compiling");
  });

  it("should analyze circuits methods", async () => {
    console.log("Analyzing circuits methods...");
    console.time("methods analyzed");
    const methods: {
      name: string;
      result: any;
      skip: boolean;
    }[] = [];
    methods.push({
      name: "DEXProgram",
      result: await DEXProgram.analyzeMethods(),
      skip: false,
    });
    methods.push({
      name: "DEXContract",
      result: await DEXContract.analyzeMethods(),
      skip: false,
    });

    console.timeEnd("methods analyzed");
    const maxRows = 2 ** 16;
    for (const contract of methods) {
      // calculate the size of the contract - the sum or rows for each method
      const size = Object.values(contract.result).reduce(
        (acc, method) => acc + (method as any).rows,
        0
      );
      // calculate percentage rounded to 0 decimal places
      const percentage =
        Math.round((((size as number) * 100) / maxRows) * 100) / 100;

      console.log(
        `${contract.name} rows: ${size} (${percentage}% of max ${maxRows} rows)`
      );
      if (contract.skip !== true)
        for (const method in contract.result) {
          console.log(
            "\t",
            method,
            `rows:`,
            (contract.result as any)[method].rows
          );
        }
    }
  });

  it("should compile DEX Program", async () => {
    console.log("compiling DEX Program...");
    console.time("compiled DEX Program");
    const cache = Cache.FileSystem("./cache");
    const { verificationKey } = await DEXProgram.compile({ cache });
    vk = verificationKey;
    const vk_data = process.env.CIRCUIT_VERIFICATION_KEY_DATA;
    const vk_hash = process.env.CIRCUIT_VERIFICATION_KEY_HASH;
    if (
      vk_data !== verificationKey.data ||
      vk_hash !== verificationKey.hash.toBigInt().toString()
    ) {
      console.log("Program verification key changed");
      console.log("vkProgram", {
        hash: verificationKey.hash.toBigInt().toString(),
        data: verificationKey.data,
      });
    }
    console.timeEnd("compiled DEX Program");
  });

  it("should compile DEX Contract", async () => {
    console.log("compiling DEX Contract...");
    console.time("compiled DEX Contract");
    const cache = Cache.FileSystem("./cache");
    const { verificationKey } = await DEXContract.compile({ cache });
    vkContract = verificationKey;
    const vk_data = process.env.CONTRACT_VERIFICATION_KEY_DATA;
    const vk_hash = process.env.CONTRACT_VERIFICATION_KEY_HASH;
    if (
      vk_data !== verificationKey.data ||
      vk_hash !== verificationKey.hash.toBigInt().toString()
    ) {
      console.log("Contract verification key changed");
      console.log("vkContract", {
        hash: verificationKey.hash.toBigInt().toString(),
        data: verificationKey.data,
      });
    }
    console.timeEnd("compiled DEX Contract");
  });

  it("should deploy a DEX Contract", async () => {
    console.time("deployed");

    await fetchMinaAccount({ publicKey: admin, force: true });

    const tx = await Mina.transaction(
      {
        sender: admin,
        fee: 100_000_000,
        memo: `Deploy DEX Contract`,
      },
      async () => {
        AccountUpdate.fundNewAccount(admin, 1);

        await dex.deploy({
          admin: admin,
          uri: `DEX Contract`,
        });
      }
    );
    await tx.prove();
    assert.strictEqual(
      (
        await sendTx({
          tx: tx.sign([admin.key, poolKey.key]),
          description: "deploy DEX Contract",
        })
      )?.status,
      expectedTxStatus
    );
    console.timeEnd("deployed");
  });

  it("should create proofs", async () => {
    console.log("proving...");
    if (!vk) {
      throw new Error("vk is null");
    }
    console.time("proved");
    for (const item of fieldOperations) {
      console.log(`proving ${item.operation.toString()}...`);
      console.time(item.operation.toString());
      let dexProof: DEXProof;
      switch (item.operation) {
        case Operation.CREATE_ACCOUNT:
          {
            const { proof, auxiliaryOutput } = await DEXProgram.createAccount(
              dexState,
              maps[maps.length - 1],
              item.action as RollupActionCreateAccount
            );
            dexProof = proof;
            maps.push(auxiliaryOutput.map);
            const account = auxiliaryOutput.account;
            // console.log("account", account);
            // map.root = proof.publicOutput.root;
            // map.length = proof.publicOutput.length;
            dexState = proof.publicOutput;
          }
          break;
        case Operation.ASK:
          {
            const account = new RollupUserTradingAccount({
              baseTokenBalance: RollupMinaBalance.fromAccountData({
                amount: faucetBaseTokenAmount,
                stakedAmount: 0n,
                borrowedAmount: 0n,
              }),
              quoteTokenBalance: RollupMinaBalance.fromAccountData({
                amount: faucetQuoteTokenAmount,
                stakedAmount: 0n,
                borrowedAmount: 0n,
              }),
              bid: RollupOrder.fromAccountData({
                amount: 0n,
                price: 0n,
                isSome: false,
              }),
              ask: RollupOrder.fromAccountData({
                amount: 0n,
                price: 0n,
                isSome: false,
              }),
              nonce: UInt64.from(0),
            });
            const { proof, auxiliaryOutput } = await DEXProgram.ask(
              dexState,
              maps[maps.length - 1],
              item.action as RollupActionAsk,
              account
            );
            dexProof = proof;
            maps.push(auxiliaryOutput.map);
            //map.root = proof.publicOutput.root;
            //map.length = proof.publicOutput.length;
            dexState = proof.publicOutput;
          }
          break;
        case Operation.BID:
          {
            const account = new RollupUserTradingAccount({
              baseTokenBalance: RollupMinaBalance.fromAccountData({
                amount: faucetBaseTokenAmount,
                stakedAmount: 0n,
                borrowedAmount: 0n,
              }),
              quoteTokenBalance: RollupMinaBalance.fromAccountData({
                amount: faucetQuoteTokenAmount,
                stakedAmount: 0n,
                borrowedAmount: 0n,
              }),
              bid: RollupOrder.fromAccountData({
                amount: 0n,
                price: 0n,
                isSome: false,
              }),
              ask: RollupOrder.fromAccountData({
                amount: 0n,
                price: 0n,
                isSome: false,
              }),
              nonce: UInt64.from(0),
            });
            const { proof, auxiliaryOutput } = await DEXProgram.bid(
              dexState,
              maps[maps.length - 1],
              item.action as RollupActionBid,
              account
            );
            dexProof = proof;
            maps.push(auxiliaryOutput.map);
            //map.root = proof.publicOutput.root;
            //map.length = proof.publicOutput.length;
            dexState = proof.publicOutput;
          }
          break;
        case Operation.TRADE:
          {
            const buyerAccount = new RollupUserTradingAccount({
              baseTokenBalance: RollupMinaBalance.fromAccountData({
                amount: faucetBaseTokenAmount,
                stakedAmount: 0n,
                borrowedAmount: 0n,
              }),
              quoteTokenBalance: RollupMinaBalance.fromAccountData({
                amount: faucetQuoteTokenAmount,
                stakedAmount: 0n,
                borrowedAmount: 0n,
              }),
              bid: RollupOrder.fromAccountData({
                amount: tradeBaseTokenAmount,
                price: tradePrice,
                isSome: true,
              }),
              ask: RollupOrder.fromAccountData({
                amount: 0n,
                price: 0n,
                isSome: false,
              }),
              nonce: UInt64.from(1),
            });
            const sellerAccount = new RollupUserTradingAccount({
              baseTokenBalance: RollupMinaBalance.fromAccountData({
                amount: faucetBaseTokenAmount,
                stakedAmount: 0n,
                borrowedAmount: 0n,
              }),
              quoteTokenBalance: RollupMinaBalance.fromAccountData({
                amount: faucetQuoteTokenAmount,
                stakedAmount: 0n,
                borrowedAmount: 0n,
              }),
              bid: RollupOrder.fromAccountData({
                amount: 0n,
                price: 0n,
                isSome: false,
              }),
              ask: RollupOrder.fromAccountData({
                amount: tradeBaseTokenAmount,
                price: tradePrice,
                isSome: true,
              }),
              nonce: UInt64.from(1),
            });
            const { proof, auxiliaryOutput } = await DEXProgram.trade(
              dexState,
              maps[maps.length - 1],
              item.action as RollupActionTrade,
              buyerAccount,
              sellerAccount
            );
            dexProof = proof;
            maps.push(auxiliaryOutput.map);
            //map.root = proof.publicOutput.root;
            //map.length = proof.publicOutput.length;
            dexState = proof.publicOutput;
          }
          break;
        case Operation.TRANSFER:
          {
            const senderAccount = new RollupUserTradingAccount({
              baseTokenBalance: RollupMinaBalance.fromAccountData({
                amount:
                  1_000_000_000_000n -
                  faucetBaseTokenAmount *
                    (
                      item.action as RollupActionTransfer
                    ).senderNonce.toBigInt(),
                stakedAmount: 0n,
                borrowedAmount: 0n,
              }),
              quoteTokenBalance: RollupMinaBalance.fromAccountData({
                amount:
                  2_000_000_000_000_000n -
                  faucetQuoteTokenAmount *
                    (
                      item.action as RollupActionTransfer
                    ).senderNonce.toBigInt(),
                stakedAmount: 0n,
                borrowedAmount: 0n,
              }),
              bid: RollupOrder.fromAccountData({
                amount: 0n,
                price: 0n,
                isSome: false,
              }),
              ask: RollupOrder.fromAccountData({
                amount: 0n,
                price: 0n,
                isSome: false,
              }),
              nonce: UInt64.from(
                (item.action as RollupActionTransfer).senderNonce
              ),
            });
            const receiverAccount = new RollupUserTradingAccount({
              baseTokenBalance: RollupMinaBalance.fromAccountData({
                amount: 0n,
                stakedAmount: 0n,
                borrowedAmount: 0n,
              }),
              quoteTokenBalance: RollupMinaBalance.fromAccountData({
                amount: 0n,
                stakedAmount: 0n,
                borrowedAmount: 0n,
              }),
              bid: RollupOrder.fromAccountData({
                amount: 0n,
                price: 0n,
                isSome: false,
              }),
              ask: RollupOrder.fromAccountData({
                amount: 0n,
                price: 0n,
                isSome: false,
              }),
              nonce: UInt64.from(0),
            });
            const { proof, auxiliaryOutput } = await DEXProgram.transfer(
              dexState,
              maps[maps.length - 1],
              item.action as RollupActionTransfer,
              senderAccount,
              receiverAccount
            );
            dexProof = proof;
            maps.push(auxiliaryOutput.map);
            //map.root = proof.publicOutput.root;
            //map.length = proof.publicOutput.length;
            dexState = proof.publicOutput;
          }
          break;

        default:
          throw new Error(`prove: Unsupported operation: ${item.operation}`);
      }
      proofs.push(dexProof);
      console.timeEnd(item.operation.toString());
    }
    console.timeEnd("proved");
    console.log(`proofs: ${proofs.length}`);
  });

  it("should merge proofs", async () => {
    console.log("merging...");
    if (!vk) {
      throw new Error("vk is null");
    }
    console.time("merged");
    let i = 0;
    for (const job of mergeJobs) {
      console.log(`merging ${job[0]} and ${job[1]}...`);
      console.time(job.toString());
      const mergedProof = await DEXProgram.merge(
        proofs[job[0]].publicInput,
        proofs[job[0]],
        proofs[job[1]]
      );
      console.timeEnd(job.toString());
      proofs.push(mergedProof.proof);
    }
    console.timeEnd("merged");
    blockProof = JSON.stringify(proofs[proofs.length - 1].toJSON(), null, 2);
    const blockProofJson = JSON.parse(blockProof) as JsonProof;
    const ok = await verify(blockProofJson, vk);
    console.log(`block proof: ${ok}`);
  });
  it("should settle proof on L1", async () => {
    Memory.info("before settle");
    console.time("settled");
    await fetchMinaAccount({ publicKey: admin, force: true });
    await fetchMinaAccount({ publicKey: poolKey, force: true });
    if (!blockProof) {
      throw new Error("blockProof is null");
    }
    const blockProofJson = JSON.parse(blockProof) as JsonProof;
    const proof = await DEXProof.fromJSON(blockProofJson);

    const tx = await Mina.transaction(
      {
        sender: admin,
        fee: 100_000_000,
        memo: `Settle proof`.substring(0, 30),
      },
      async () => {
        await dex.settle(proof);
      }
    );
    await tx.prove();
    assert.strictEqual(
      (
        await sendTx({
          tx: tx.sign([admin.key]),
          description: "settle proof",
        })
      )?.status,
      expectedTxStatus
    );
    console.timeEnd("settled");
  });
});
