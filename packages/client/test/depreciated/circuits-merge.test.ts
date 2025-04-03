// import { describe, it } from "node:test";
// import assert from "node:assert";
// import {
//   UInt32,
//   Bool,
//   UInt64,
//   PrivateKey,
//   PublicKey,
//   Field,
//   Struct,
//   ZkProgram,
//   Gadgets,
//   Provable,
//   Cache,
//   Signature,
//   VerificationKey,
//   verify,
// } from "o1js";
// import {
//   DEXCreateAccountProgram,
//   DEXBidProgram,
//   DEXAskProgram,
//   DEXTradeProgram,
//   DEXTransferProgram,
//   DEXMergeProgram,
//   DEXMergeProof,
//   circuits,
//   DEXProof,
// } from "../../src/contracts/depreciated/circuits.js";
// import { verificationKeys as previousVerificationKeys } from "../../src/contracts/depreciated/vk.js";
// import {
//   Operation,
//   ActionCreateAccount,
//   ActionAsk,
//   ActionBid,
//   ActionTransfer,
//   ActionTrade,
// } from "../../src/types.js";
// import {
//   RollupActionCreateAccount,
//   RollupActionAsk,
//   RollupActionBid,
//   RollupActionTransfer,
//   RollupActionTrade,
//   DEXMap,
//   DEXState,
//   RollupUserTradingAccount,
//   RollupOrder,
// } from "../../src/contracts/types.js";
// import { signDexFields } from "../../src/sign.js";

// function getUser() {
//   const privateKey = PrivateKey.random();
//   return {
//     publicKey: privateKey.toPublicKey(),
//     privateKey,
//   };
// }

// //let accountCreateVk: VerificationKey | null = null;
// let mergeVk: VerificationKey | null = null;
// const poolPublicKey = PrivateKey.random().toPublicKey();
// const faucetBaseTokenAmount = 1_000_000_000n;
// const faucetQuoteTokenAmount = 2_000_000_000_000n;
// const tradeBaseTokenAmount = 1_000_000_000n;
// const tradeQuoteTokenAmount = 2_000_000_000_000n;
// const tradePrice = 2_000_000_000_000n;
// const users: {
//   [key: string]: {
//     publicKey: PublicKey;
//     privateKey: PrivateKey;
//   };
// } = {
//   alice: getUser(),
//   bob: getUser(),
//   faucet: getUser(),
// };

// const operations: {
//   operation: Operation;
//   action:
//     | ActionCreateAccount
//     | ActionAsk
//     | ActionBid
//     | ActionTransfer
//     | ActionTrade;
// }[] = [
//   {
//     operation: Operation.CREATE_ACCOUNT,
//     action: {
//       poolPublicKey: poolPublicKey.toBase58(),
//       publicKey: users.faucet.publicKey.toBase58(),
//       baseBalance: 1_000_000_000_000n,
//       quoteBalance: 2_000_000_000_000_000n,
//       nonce: 0n,
//       address: "",
//       publicKeyBase58: users.faucet.publicKey.toBase58(),
//       name: "Faucet",
//       role: "faucet",
//       image: "",
//     } as ActionCreateAccount,
//   },
//   {
//     operation: Operation.CREATE_ACCOUNT,
//     action: {
//       poolPublicKey: poolPublicKey.toBase58(),
//       publicKey: users.alice.publicKey.toBase58(),
//       baseBalance: 0n,
//       quoteBalance: 0n,
//       nonce: 0n,
//       address: "",
//       publicKeyBase58: users.alice.publicKey.toBase58(),
//       name: "Alice",
//       role: "user",
//       image: "",
//     } as ActionCreateAccount,
//   },
//   {
//     operation: Operation.CREATE_ACCOUNT,
//     action: {
//       poolPublicKey: poolPublicKey.toBase58(),
//       publicKey: users.bob.publicKey.toBase58(),
//       baseBalance: 0n,
//       quoteBalance: 0n,
//       nonce: 0n,
//       address: "",
//       publicKeyBase58: users.bob.publicKey.toBase58(),
//       name: "Bob",
//       role: "user",
//       image: "",
//     } as ActionCreateAccount,
//   },
//   {
//     operation: Operation.TRANSFER,
//     action: {
//       senderPublicKey: users.faucet.publicKey.toBase58(),
//       receiverPublicKey: users.alice.publicKey.toBase58(),
//       baseTokenAmount: faucetBaseTokenAmount,
//       quoteTokenAmount: faucetQuoteTokenAmount,
//       senderNonce: 0,
//       receiverNonce: 0,
//       senderSignature: (
//         await signDexFields({
//           poolPublicKey: poolPublicKey.toBase58(),
//           minaPrivateKey: users.faucet.privateKey.toBase58(),
//           operation: Operation.TRANSFER,
//           nonce: 0,
//           baseTokenAmount: faucetBaseTokenAmount,
//           quoteTokenAmount: faucetQuoteTokenAmount,
//           receiverPublicKey: users.alice.publicKey.toBase58(),
//         })
//       ).minaSignature,
//     } as ActionTransfer,
//   },
//   {
//     operation: Operation.TRANSFER,
//     action: {
//       senderPublicKey: users.faucet.publicKey.toBase58(),
//       receiverPublicKey: users.bob.publicKey.toBase58(),
//       baseTokenAmount: faucetBaseTokenAmount,
//       quoteTokenAmount: faucetQuoteTokenAmount,
//       senderNonce: 1,
//       receiverNonce: 0,
//       senderSignature: (
//         await signDexFields({
//           poolPublicKey: poolPublicKey.toBase58(),
//           minaPrivateKey: users.faucet.privateKey.toBase58(),
//           operation: Operation.TRANSFER,
//           nonce: 1,
//           baseTokenAmount: faucetBaseTokenAmount,
//           quoteTokenAmount: faucetQuoteTokenAmount,
//           receiverPublicKey: users.bob.publicKey.toBase58(),
//         })
//       ).minaSignature,
//     } as ActionTransfer,
//   },
//   {
//     operation: Operation.ASK,
//     action: {
//       userPublicKey: users.alice.publicKey.toBase58(),
//       poolPublicKey: poolPublicKey.toBase58(),
//       baseTokenAmount: tradeBaseTokenAmount,
//       price: tradePrice,
//       isSome: true,
//       nonce: 1,
//       userSignature: (
//         await signDexFields({
//           poolPublicKey: poolPublicKey.toBase58(),
//           minaPrivateKey: users.alice.privateKey.toBase58(),
//           operation: Operation.ASK,
//           nonce: 1,
//           baseTokenAmount: tradeBaseTokenAmount,
//           price: tradePrice,
//         })
//       ).minaSignature,
//     } as ActionAsk,
//   },
//   {
//     operation: Operation.BID,
//     action: {
//       userPublicKey: users.bob.publicKey.toBase58(),
//       poolPublicKey: poolPublicKey.toBase58(),
//       baseTokenAmount: tradeBaseTokenAmount,
//       price: tradePrice,
//       isSome: true,
//       nonce: 1,
//       userSignature: (
//         await signDexFields({
//           poolPublicKey: poolPublicKey.toBase58(),
//           minaPrivateKey: users.bob.privateKey.toBase58(),
//           operation: Operation.BID,
//           nonce: 1,
//           baseTokenAmount: tradeBaseTokenAmount,
//           price: tradePrice,
//         })
//       ).minaSignature,
//     } as ActionBid,
//   },
//   {
//     operation: Operation.TRADE,
//     action: {
//       buyerPublicKey: users.bob.publicKey.toBase58(),
//       sellerPublicKey: users.alice.publicKey.toBase58(),
//       poolPublicKey: poolPublicKey.toBase58(),
//       baseTokenAmount: tradeBaseTokenAmount,
//       quoteTokenAmount: tradeQuoteTokenAmount,
//       price: tradePrice,
//       buyerNonce: 2,
//       sellerNonce: 2,
//     } as ActionTrade,
//   },
// ];

// function convertActionToRollupAction(params: {
//   operation: Operation;
//   action:
//     | ActionCreateAccount
//     | ActionAsk
//     | ActionBid
//     | ActionTransfer
//     | ActionTrade;
// }):
//   | RollupActionCreateAccount
//   | RollupActionAsk
//   | RollupActionBid
//   | RollupActionTransfer
//   | RollupActionTrade {
//   const { action, operation } = params;
//   switch (operation) {
//     case Operation.CREATE_ACCOUNT:
//       return RollupActionCreateAccount.fromAction(
//         action as ActionCreateAccount
//       );
//     case Operation.ASK:
//       return RollupActionAsk.fromAction(action as ActionAsk);
//     case Operation.BID:
//       return RollupActionBid.fromAction(action as ActionBid);
//     case Operation.TRANSFER:
//       return RollupActionTransfer.fromAction(action as ActionTransfer);
//     case Operation.TRADE:
//       return RollupActionTrade.fromAction(action as ActionTrade);
//     default:
//       throw new Error(
//         `convertActionToRollupAction: Unsupported operation: ${operation}`
//       );
//   }
// }

// const fieldOperations: {
//   operation: Operation;
//   action:
//     | RollupActionCreateAccount
//     | RollupActionAsk
//     | RollupActionBid
//     | RollupActionTransfer
//     | RollupActionTrade;
// }[] = operations.map((item) => ({
//   operation: item.operation,
//   action: convertActionToRollupAction({
//     operation: item.operation,
//     action: item.action,
//   }),
// }));

// const proofs: { proof: DEXProof | DEXMergeProof; vk: VerificationKey }[] = [];
// const mergeJobs: number[][] = [
//   [0, 1],
//   [2, 3],
//   [4, 5],
//   [6, 7],
//   [8, 9],
//   [10, 11],
//   [12, 13],
// ];
// let map = new DEXMap();
// let dexState = new DEXState({
//   poolPublicKey: poolPublicKey,
//   root: map.root,
//   length: map.length,
//   actionState: Field.random(),
//   sequence: UInt64.from(0),
//   verificationKey: Field.fromJSON(
//     previousVerificationKeys["DEXMergeProgram"].hash
//   ),
// });

// describe("Circuits", async () => {
//   it("should analyze circuits methods", async () => {
//     console.log("Analyzing circuits methods...");
//     console.time("methods analyzed");
//     const methods: {
//       name: string;
//       result: any;
//       skip: boolean;
//     }[] = [];
//     for (const circuit of circuits) {
//       methods.push({
//         name: circuit.name,
//         result: await circuit.circuit.analyzeMethods(),
//         skip: false,
//       });
//     }

//     console.timeEnd("methods analyzed");
//     const maxRows = 2 ** 16;
//     for (const contract of methods) {
//       // calculate the size of the contract - the sum or rows for each method
//       const size = Object.values(contract.result).reduce(
//         (acc, method) => acc + (method as any).rows,
//         0
//       );
//       // calculate percentage rounded to 0 decimal places
//       const percentage =
//         Math.round((((size as number) * 100) / maxRows) * 100) / 100;

//       console.log(
//         `${contract.name} rows: ${size} (${percentage}% of max ${maxRows} rows)`
//       );
//       if (contract.skip !== true)
//         for (const method in contract.result) {
//           console.log(
//             "\t",
//             method,
//             `rows:`,
//             (contract.result as any)[method].rows
//           );
//         }
//     }
//   });

//   it("should compile DEX Circuits", async () => {
//     console.log("compiling...");
//     console.time("compiled");
//     const cache = Cache.FileSystem("./cache");
//     const verificationKeys: {
//       [key: string]: { hash: string; data: string };
//     } = {};
//     for (const circuit of circuits) {
//       console.time(circuit.name);
//       const { verificationKey } = await circuit.circuit.compile({ cache });
//       verificationKeys[circuit.name] = {
//         hash: verificationKey.hash.toJSON() as string,
//         data: verificationKey.data,
//       };
//       console.timeEnd(circuit.name);
//       // if (circuit.name === "DEXCreateAccountProgram") {
//       //   accountCreateVk = verificationKey;
//       // }
//       if (circuit.name === "DEXMergeProgram") {
//         mergeVk = verificationKey;
//       }
//     }
//     console.timeEnd("compiled");
//     const keysEqual = Object.keys(verificationKeys).every((key) => {
//       return (
//         verificationKeys[key].hash === previousVerificationKeys[key].hash &&
//         verificationKeys[key].data === previousVerificationKeys[key].data
//       );
//     });
//     if (!keysEqual) {
//       console.log("verificationKeys", verificationKeys);
//     } else {
//       console.log("Verification keys are equal");
//     }
//   });

//   it("should create proofs", async () => {
//     console.log("proving...");
//     console.time("proved");
//     for (const item of fieldOperations) {
//       console.log(`proving ${item.operation.toString()}...`);
//       console.time(item.operation.toString());
//       let dexProof: DEXProof;
//       let vk: VerificationKey | null = null;
//       switch (item.operation) {
//         case Operation.CREATE_ACCOUNT:
//           {
//             const { proof, auxiliaryOutput } =
//               await DEXCreateAccountProgram.createAccount(
//                 dexState,
//                 map,
//                 item.action as RollupActionCreateAccount
//               );
//             dexProof = DEXProof.fromProof(proof);
//             map.root = proof.publicOutput.root;
//             map.length = proof.publicOutput.length;
//             dexState = proof.publicOutput;
//             vk = VerificationKey.fromValue({
//               hash: Field.fromJSON(
//                 previousVerificationKeys["DEXCreateAccountProgram"].hash
//               ),
//               data: previousVerificationKeys["DEXCreateAccountProgram"].data,
//             });
//           }
//           break;
//         case Operation.ASK:
//           {
//             const account = new RollupUserTradingAccount({
//               baseTokenBalance: {
//                 amount: UInt64.from(faucetBaseTokenAmount),
//                 stakedAmount: UInt64.from(0),
//                 borrowedAmount: UInt64.from(0),
//               },
//               quoteTokenBalance: {
//                 amount: UInt64.from(faucetQuoteTokenAmount),
//                 stakedAmount: UInt64.from(0),
//                 borrowedAmount: UInt64.from(0),
//               },
//               bid: new RollupOrder({
//                 amount: UInt64.from(0),
//                 price: UInt64.from(0),
//               }),
//               ask: new RollupOrder({
//                 amount: UInt64.from(0),
//                 price: UInt64.from(0),
//               }),
//               nonce: UInt64.from(0),
//             });
//             const { proof, auxiliaryOutput } = await DEXAskProgram.ask(
//               dexState,
//               map,
//               item.action as RollupActionAsk,
//               account
//             );
//             dexProof = DEXProof.fromProof(proof);
//             map = auxiliaryOutput;
//             map.root = proof.publicOutput.root;
//             map.length = proof.publicOutput.length;
//             dexState = proof.publicOutput;
//             vk = VerificationKey.fromValue({
//               hash: Field.fromJSON(
//                 previousVerificationKeys["DEXAskProgram"].hash
//               ),
//               data: previousVerificationKeys["DEXAskProgram"].data,
//             });
//           }
//           break;
//         case Operation.BID:
//           {
//             const account = new RollupUserTradingAccount({
//               baseTokenBalance: {
//                 amount: UInt64.from(faucetBaseTokenAmount),
//                 stakedAmount: UInt64.from(0),
//                 borrowedAmount: UInt64.from(0),
//               },
//               quoteTokenBalance: {
//                 amount: UInt64.from(faucetQuoteTokenAmount),
//                 stakedAmount: UInt64.from(0),
//                 borrowedAmount: UInt64.from(0),
//               },
//               bid: new RollupOrder({
//                 amount: UInt64.from(0),
//                 price: UInt64.from(0),
//               }),
//               ask: new RollupOrder({
//                 amount: UInt64.from(0),
//                 price: UInt64.from(0),
//               }),
//               nonce: UInt64.from(0),
//             });
//             const { proof, auxiliaryOutput } = await DEXBidProgram.bid(
//               dexState,
//               map,
//               item.action as RollupActionBid,
//               account
//             );
//             dexProof = DEXProof.fromProof(proof);
//             map = auxiliaryOutput;
//             map.root = proof.publicOutput.root;
//             map.length = proof.publicOutput.length;
//             dexState = proof.publicOutput;
//             vk = VerificationKey.fromValue({
//               hash: Field.fromJSON(
//                 previousVerificationKeys["DEXBidProgram"].hash
//               ),
//               data: previousVerificationKeys["DEXBidProgram"].data,
//             });
//           }
//           break;
//         case Operation.TRADE:
//           {
//             const buyerAccount = new RollupUserTradingAccount({
//               baseTokenBalance: {
//                 amount: UInt64.from(faucetBaseTokenAmount),
//                 stakedAmount: UInt64.from(0),
//                 borrowedAmount: UInt64.from(0),
//               },
//               quoteTokenBalance: {
//                 amount: UInt64.from(faucetQuoteTokenAmount),
//                 stakedAmount: UInt64.from(0),
//                 borrowedAmount: UInt64.from(0),
//               },
//               bid: new RollupOrder({
//                 amount: UInt64.from(tradeBaseTokenAmount),
//                 price: UInt64.from(tradePrice),
//               }),
//               ask: new RollupOrder({
//                 amount: UInt64.from(0),
//                 price: UInt64.from(0),
//               }),
//               nonce: UInt64.from(1),
//             });
//             const sellerAccount = new RollupUserTradingAccount({
//               baseTokenBalance: {
//                 amount: UInt64.from(faucetBaseTokenAmount),
//                 stakedAmount: UInt64.from(0),
//                 borrowedAmount: UInt64.from(0),
//               },
//               quoteTokenBalance: {
//                 amount: UInt64.from(faucetQuoteTokenAmount),
//                 stakedAmount: UInt64.from(0),
//                 borrowedAmount: UInt64.from(0),
//               },
//               bid: new RollupOrder({
//                 amount: UInt64.from(0),
//                 price: UInt64.from(0),
//               }),
//               ask: new RollupOrder({
//                 amount: UInt64.from(tradeBaseTokenAmount),
//                 price: UInt64.from(tradePrice),
//               }),
//               nonce: UInt64.from(1),
//             });
//             const { proof, auxiliaryOutput } = await DEXTradeProgram.trade(
//               dexState,
//               map,
//               item.action as RollupActionTrade,
//               buyerAccount,
//               sellerAccount
//             );
//             dexProof = DEXProof.fromProof(proof);
//             map = auxiliaryOutput;
//             map.root = proof.publicOutput.root;
//             map.length = proof.publicOutput.length;
//             dexState = proof.publicOutput;
//             vk = VerificationKey.fromValue({
//               hash: Field.fromJSON(
//                 previousVerificationKeys["DEXTradeProgram"].hash
//               ),
//               data: previousVerificationKeys["DEXTradeProgram"].data,
//             });
//           }
//           break;
//         case Operation.TRANSFER:
//           {
//             const senderAccount = new RollupUserTradingAccount({
//               baseTokenBalance: {
//                 amount: UInt64.from(
//                   1_000_000_000_000n -
//                     faucetBaseTokenAmount *
//                       (
//                         item.action as RollupActionTransfer
//                       ).senderNonce.toBigInt()
//                 ),
//                 stakedAmount: UInt64.from(0),
//                 borrowedAmount: UInt64.from(0),
//               },
//               quoteTokenBalance: {
//                 amount: UInt64.from(
//                   2_000_000_000_000_000n -
//                     faucetQuoteTokenAmount *
//                       (
//                         item.action as RollupActionTransfer
//                       ).senderNonce.toBigInt()
//                 ),
//                 stakedAmount: UInt64.from(0),
//                 borrowedAmount: UInt64.from(0),
//               },
//               bid: new RollupOrder({
//                 amount: UInt64.from(0),
//                 price: UInt64.from(0),
//               }),
//               ask: new RollupOrder({
//                 amount: UInt64.from(0),
//                 price: UInt64.from(0),
//               }),
//               nonce: UInt64.from(
//                 (item.action as RollupActionTransfer).senderNonce
//               ),
//             });
//             const receiverAccount = new RollupUserTradingAccount({
//               baseTokenBalance: {
//                 amount: UInt64.from(0),
//                 stakedAmount: UInt64.from(0),
//                 borrowedAmount: UInt64.from(0),
//               },
//               quoteTokenBalance: {
//                 amount: UInt64.from(0),
//                 stakedAmount: UInt64.from(0),
//                 borrowedAmount: UInt64.from(0),
//               },
//               bid: new RollupOrder({
//                 amount: UInt64.from(0),
//                 price: UInt64.from(0),
//               }),
//               ask: new RollupOrder({
//                 amount: UInt64.from(0),
//                 price: UInt64.from(0),
//               }),
//               nonce: UInt64.from(0),
//             });
//             const { proof, auxiliaryOutput } =
//               await DEXTransferProgram.transfer(
//                 dexState,
//                 map,
//                 item.action as RollupActionTransfer,
//                 senderAccount,
//                 receiverAccount
//               );
//             dexProof = DEXProof.fromProof(proof);
//             map = auxiliaryOutput;
//             map.root = proof.publicOutput.root;
//             map.length = proof.publicOutput.length;
//             dexState = proof.publicOutput;
//             vk = VerificationKey.fromValue({
//               hash: Field.fromJSON(
//                 previousVerificationKeys["DEXTransferProgram"].hash
//               ),
//               data: previousVerificationKeys["DEXTransferProgram"].data,
//             });
//           }
//           break;

//         default:
//           throw new Error(`prove: Unsupported operation: ${item.operation}`);
//       }
//       if (!vk) {
//         throw new Error(
//           `prove: Verification key is null for ${item.operation}`
//         );
//       }
//       proofs.push({ proof: dexProof, vk });
//       console.timeEnd(item.operation.toString());
//     }
//     console.timeEnd("proved");
//     console.log(`proofs: ${proofs.length}`);
//   });

//   it("should merge proofs", async () => {
//     console.log("merging...");
//     const vk = VerificationKey.fromValue({
//       hash: Field.fromJSON(previousVerificationKeys["DEXMergeProgram"].hash),
//       data: previousVerificationKeys["DEXMergeProgram"].data,
//     });
//     if (vk.data !== mergeVk?.data) {
//       throw new Error("vk.data !== mergeVk.data");
//     }
//     if (vk.hash.toJSON() !== mergeVk?.hash.toJSON()) {
//       throw new Error("vk.hash !== mergeVk.hash");
//     }
//     // if (!accountCreateVk) {
//     //   throw new Error("accountCreateVk is null");
//     // }
//     if (!mergeVk) {
//       throw new Error("mergeVk is null");
//     }
//     console.time("merged");
//     let i = 0;
//     for (const job of mergeJobs) {
//       console.log(`merging ${job[0]} and ${job[1]}...`);
//       console.time(job.toString());
//       //console.log("job 0", proofs[job[0]]);
//       //console.log("job 1", proofs[job[1]]);
//       const isSelfProof1: boolean = (proofs[job[0]].vk.data ===
//         mergeVk.data) as boolean;
//       const isSelfProof2: boolean = (proofs[job[1]].vk.data ===
//         mergeVk.data) as boolean;
//       console.log("isSelfProof1", isSelfProof1);
//       console.log("isSelfProof2", isSelfProof2);
//       const ok1 = await verify(
//         proofs[job[0]].proof.toJSON(),
//         proofs[job[0]].vk
//       );
//       console.log("ok1", ok1);
//       const ok2 = await verify(
//         proofs[job[1]].proof.toJSON(),
//         proofs[job[1]].vk
//       );
//       console.log("ok2", ok2);
//       DEXState.assertEquals(
//         proofs[job[0]].proof.publicOutput,
//         proofs[job[1]].proof.publicInput
//       );
//       console.log("state equal");
//       console.time("convert 1");
//       let proof1: DEXMergeProof = isSelfProof1
//         ? (proofs[job[0]].proof as DEXMergeProof)
//         : (
//             await DEXMergeProgram.convert(
//               proofs[job[0]].proof.publicInput,
//               proofs[job[0]].proof,
//               proofs[job[0]].vk
//             )
//           ).proof;
//       console.timeEnd("convert 1");
//       console.time("convert 2");
//       let proof2: DEXMergeProof = isSelfProof2
//         ? (proofs[job[1]].proof as DEXMergeProof)
//         : (
//             await DEXMergeProgram.convert(
//               proofs[job[1]].proof.publicInput,
//               proofs[job[1]].proof,
//               proofs[job[1]].vk
//             )
//           ).proof;
//       console.timeEnd("convert 2");
//       console.time("merge");
//       const mergedProof = await DEXMergeProgram.merge(
//         proof1.publicInput,
//         proof1,
//         proof2
//       );
//       console.timeEnd("merge");
//       console.log("mergedProof", job[0], job[1]);
//       console.timeEnd(job.toString());
//       proofs.push({ proof: mergedProof.proof, vk: mergeVk });
//     }
//     console.timeEnd("merged");
//     const blockProof = proofs[proofs.length - 1].proof.toJSON();
//     const ok = await verify(blockProof, mergeVk);
//     console.log(`block proof: ${ok}`);
//   });
// });
