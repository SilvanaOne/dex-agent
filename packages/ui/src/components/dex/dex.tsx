"use client";

import { useState, useEffect, useContext } from "react";
import { shortenString } from "@/lib/short";
import {
  PendingTransactions,
  TransactionType,
  LastTransactionData,
  LastTransactionErrors,
  NetworkInfoData,
  OrderFormState,
  UserTradingAccount,
  fetchDexAccount,
  publicKeyToU256,
  DexConfig,
  getConfig,
  createAccount as createDexAccount,
  faucet as dexFaucet,
  waitTx,
  orderWithPayload,
  prepareOrderPayload,
  getUserKey,
  getNetworkInfo,
  fetchDexVersion,
  fetchDex,
  DexObject,
  getOrderbook,
  Orderbook,
  findUserDeal,
  Deal,
  settleDeal,
  fetchDexEvents,
  OperationEvent,
  ActionTrade,
  ActionBid,
  ActionAsk,
  ActionTransfer,
  RollupEvent,
  MinaTransactionEvent,
  fetchProofEvents,
  fetchSettlementTransactionEvents,
  blockCreationNeeded,
  checkBlockCreation,
  agentProveAccount,
  dexProverResult,
  sleep,
  fetchBlockSequences,
  pingUserKey,
  checkDeals,
} from "@dex-agent/lib";
import OrderBook from "@/components/dex/order-book";
import { OrderForm } from "@/components/dex/order-form";
import UserAccount from "@/components/dex/user-account";
import OpenOrders from "@/components/dex/open-orders";
import SqlQuery from "@/components/dex/sql";
import { MarketTrades, Trade } from "@/components/dex/market-trades";
import { LastOrders, LastOrder } from "@/components/dex/last-orders";
import { LastProofs, Proof, ProofType } from "@/components/dex/last-proofs";
import LastL1Txs from "@/components/dex/last-l1-txs";
import LastTransaction from "@/components/dex/last-transaction";
import NetworkInfo from "@/components/dex/network-info";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getEthPrice } from "@dex-agent/lib";
import { formatPrice } from "@/lib/format";

import { AddressContext } from "@/context/address";
import { getWalletInfo, connectWallet } from "@/lib/wallet";
import { checkAddress } from "@/lib/address";
import { log } from "@/lib/log";
const DEBUG = process.env.NEXT_PUBLIC_DEBUG === "true";

// Use dynamic import with SSR disabled for the chart component
const TradingChart = dynamic(() => import("@/components/dex/trading-chart"), {
  ssr: false,
});

type ViewMode = "chart" | "sql";
const ALICE_PUBLIC_KEY = process.env.NEXT_PUBLIC_ALICE_PUBLIC_KEY;

export default function DEX() {
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [sqlPrice, setSqlPrice] = useState<number | undefined>(1500);
  const [sqlAmount, setSqlAmount] = useState<number | undefined>(0.1);
  const [blockOptions, setBlockOptions] = useState<number[]>([1]);
  const [sequenceOptions, setSequenceOptions] = useState<number[]>([1]);
  const [dexVersion, setDexVersion] = useState<bigint | undefined>(undefined);
  const [dex, setDex] = useState<DexObject | undefined>(undefined);
  const [orderbook, setOrderbook] = useState<Orderbook | undefined>(undefined);
  const [events, setEvents] = useState<OperationEvent[] | undefined>(undefined);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [orders, setOrders] = useState<LastOrder[]>([]);
  const [proofEvents, setProofEvents] = useState<RollupEvent[] | undefined>(
    undefined
  );
  const [l1Events, setL1Events] = useState<MinaTransactionEvent[] | undefined>(
    undefined
  );
  const [l1Tx, setL1Tx] = useState<MinaTransactionEvent | undefined>(undefined);
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [account, setAccount] = useState<UserTradingAccount | undefined>(
    undefined
  );
  const [pendingTransactions, setPendingTransactions] = useState<
    PendingTransactions | undefined
  >(undefined);
  const [priceDirection, setPriceDirection] = useState<"up" | "down">("up"); // Track price direction
  const [price, setPrice] = useState<number | undefined>(undefined);
  const [change, setChange] = useState<number | undefined>(undefined);
  const [orderType, setOrderType] = useState<TransactionType>("buy");
  const [proof, setProof] = useState<string | undefined>(undefined);
  const [jobId, setJobId] = useState<string | undefined>(undefined);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfoData | undefined>(
    undefined
  );
  const [addressU256, setAddressU256] = useState<bigint | undefined>(undefined);
  const [highlight, setHighlight] = useState<boolean>(false);
  const [user, setUser] = useState<string | undefined>(undefined);
  const [key, setKey] = useState<string | undefined>(undefined);
  const [config, setConfig] = useState<DexConfig | undefined>(undefined);
  const [txData, setTxData] = useState<
    LastTransactionData | LastTransactionErrors | null
  >(null);
  const [txProofs, setTxProofs] = useState<Proof[]>([]);
  const [processing, setProcessing] = useState<TransactionType | undefined>(
    undefined
  );
  const [addressValid, setAddressValid] = useState<boolean>(true);
  const [blockNumber, setBlockNumber] = useState<number | undefined>(undefined);
  const [sequence, setSequence] = useState<number | undefined>(undefined);
  const [displayedBlockNumber, setDisplayedBlockNumber] = useState<
    number | undefined
  >(undefined);
  const [displayedSequence, setDisplayedSequence] = useState<
    number | undefined
  >(undefined);
  const { address, setAddress } = useContext(AddressContext);

  useEffect(() => {
    async function fetchSequences() {
      console.log("Block number:", blockNumber);
      console.log("Dex block number:", dex?.block_number);
      let newBlockNumber = blockNumber;
      if (blockNumber !== undefined) {
        newBlockNumber = blockNumber;
      } else if (dex?.block_number) {
        newBlockNumber = Number(dex.block_number);
      }
      if (newBlockNumber) {
        setDisplayedBlockNumber(newBlockNumber);
        const sequences = await fetchBlockSequences({
          blockNumber: newBlockNumber,
        });
        console.log("Sequences:", sequences);
        if (sequences) {
          const start = Number(sequences.startSequence);
          const end = Number(sequences.endSequence);
          setSequenceOptions(
            Array.from({ length: end - start + 1 }, (_, i) => start + i)
          );
          if (!sequence || sequence < start || sequence > end) {
            setSequence(end);
          }
        }
      }
    }
    fetchSequences();
  }, [blockNumber, dex]);

  useEffect(() => {
    if (sequence !== undefined) {
      setDisplayedSequence(sequence);
    } else if (dex?.sequence) {
      console.log("Setting displayed sequence to", dex.sequence);
      setDisplayedSequence(Number(dex.sequence));
    }
  }, [sequence, dex]);

  useEffect(() => {
    if (dex?.block_number) {
      setBlockOptions(
        Array.from({ length: dex.block_number - 1 }, (_, i) => i + 1).reverse()
      );
    }
  }, [dex]);

  useEffect(() => {
    let mounted = true;
    let running = false;

    async function getDexVersion() {
      if (running) return;
      running = true;
      try {
        const version = await fetchDexVersion();
        if (mounted) {
          // Only update if component is still mounted
          setDexVersion(version); // Update regardless of previous value
        }
      } catch (error: any) {
        console.error("Failed to fetch dex version:", error.message);
      } finally {
        running = false;
      }
    }

    // Initial fetch
    getDexVersion();

    const intervalId = setInterval(getDexVersion, 1000);

    // Cleanup
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    async function getDex() {
      if (!dexVersion) return;
      if (dexVersion < BigInt(1)) return;
      if (dex && dex.dexObjectVersion === dexVersion) return;
      const dexObject = await fetchDex();
      if (dexObject) {
        setDex(dexObject);
        const orderbook = getOrderbook(dexObject);
        setOrderbook(orderbook);
        await checkDeals({
          key,
          verbose: false,
          useParallelExecutor: false,
        });
      }
    }
    getDex();
  }, [dexVersion]);

  useEffect(() => {
    async function settleUserDeal() {
      if (!addressU256 || !address || !dex) return;
      const deal = findUserDeal({
        dex,
        userPublicKey: address,
      });
      if (deal) {
        await settleDeal({
          deal,
          key,
          verbose: true,
        });
      }
    }
    settleUserDeal();
  }, [addressU256, dex]);

  useEffect(() => {
    async function getDexEvents() {
      if (!dex) return;
      let firstSequence = Number(dex.sequence) - 100;
      if (firstSequence < 0) {
        firstSequence = 0;
      }
      const events = await fetchDexEvents({
        firstSequence,
        lastSequence: Number(dex.sequence) - 1,
        limit: 100,
      });

      if (events) {
        setEvents(events);
      }
    }
    getDexEvents();
  }, [dex]);

  useEffect(() => {
    async function getProofEvents() {
      if (!dexVersion) return;
      const events = await fetchProofEvents({
        limit: 100,
      });
      if (events) {
        setProofEvents(events);
      }
    }
    getProofEvents();
  }, [dexVersion]);

  useEffect(() => {
    async function checkBlock() {
      if (!dexVersion || !key) return;
      const blockCreation = await blockCreationNeeded();
      if (blockCreation) {
        console.log("Block creation needed");
        const blockResult = await checkBlockCreation({
          key,
        });
        if (blockResult && blockResult.digest) {
          console.log("Block created", blockResult.digest);
          await waitTx(blockResult.digest);
        }
      }
    }
    checkBlock();
  }, [dexVersion, key]);

  useEffect(() => {
    async function getL1Events() {
      if (!dexVersion) return;
      const events = await fetchSettlementTransactionEvents({
        limit: undefined,
      });
      if (events) {
        setL1Events(events);
        if (txData && "blockNumber" in txData && "sequence") {
          const l1Tx = events.filter(
            (event) =>
              event.block_number === BigInt(txData.blockNumber) &&
              event.start_sequence <= txData.sequence &&
              event.end_sequence >= txData.sequence
          );
          if (l1Tx.length > 0) {
            setL1Tx(l1Tx[0]);
          }
        }
      }
    }
    getL1Events();
  }, [dexVersion]);

  useEffect(() => {
    if (!events) return;
    const trades: Trade[] =
      events
        ?.filter((event) => event.type === "OperationTradeEvent")
        .map((event) => {
          const trade = event.details as ActionTrade;
          return {
            id: event.operation.sequence,
            price: Number(trade.price / 1_000_000n) / 1000,
            amount: Number(trade.baseTokenAmount / 1_000_000n) / 1000,
            value: Number(trade.quoteTokenAmount / 1_000_000n) / 1000,
            time: event.timestamp,
            type: "up",
          };
        }) ?? [];
    // Determine trade type (up or down) based on price changes
    if (trades.length > 1) {
      for (let i = 0; i < trades.length - 1; i++) {
        // Compare current trade price with the next one (trades are in descending order by time)
        if (trades[i].price > trades[i + 1].price) {
          trades[i].type = "up";
        } else if (trades[i].price < trades[i + 1].price) {
          trades[i].type = "down";
        }
        // If prices are equal, keep the default "up" type
      }
    }
    setTrades(trades);
  }, [events]);

  useEffect(() => {
    if (!events) return;
    const orders: LastOrder[] =
      events
        ?.filter(
          (event) =>
            event.type === "OperationBidEvent" ||
            event.type === "OperationAskEvent" ||
            event.type === "OperationTransferEvent"
        )
        .map((event) => {
          const order = event.details as ActionBid | ActionAsk | ActionTransfer;
          const user =
            event.type === "OperationBidEvent"
              ? (order as ActionBid).userPublicKey
              : event.type === "OperationAskEvent"
              ? (order as ActionAsk).userPublicKey
              : (order as ActionTransfer).senderPublicKey;
          /*
              export interface LastOrder {
                id: number;
                operation: "Bid" | "Ask" | "Transfer";
                amount: number;
                price?: number;
                time: string;
                userAddress: string; // Add user address field
              }
          */
          const operation =
            event.type === "OperationBidEvent"
              ? "Bid"
              : event.type === "OperationAskEvent"
              ? "Ask"
              : "Transfer";
          return {
            id: event.operation.sequence,
            operation,
            amount: Number(order.baseTokenAmount / 1_000_000n) / 1000,
            price:
              "price" in order
                ? Number(order.price / 1_000_000n) / 1000
                : undefined,
            time: event.timestamp,
            userAddress: user,
          };
        }) ?? [];
    setOrders(orders);
  }, [events]);

  useEffect(() => {
    if (!proofEvents) return;
    const proofs: Proof[] = (
      proofEvents
        ?.filter(
          (event) =>
            event.type === "ProofStartedEvent" ||
            event.type === "ProofSubmittedEvent" ||
            event.type === "ProofUsedEvent" ||
            event.type === "ProofReservedEvent" ||
            event.type === "ProofReturnedEvent" ||
            event.type === "ProofRejectedEvent" ||
            event.type === "BlockProofEvent" ||
            event.type === "ProofCalculationCreatedEvent"
        )
        .map((event) => {
          const type: ProofType =
            event.type === "ProofStartedEvent"
              ? "started"
              : event.type === "ProofSubmittedEvent"
              ? "submitted"
              : event.type === "ProofUsedEvent"
              ? "used"
              : event.type === "ProofReservedEvent"
              ? "reserved"
              : event.type === "ProofReturnedEvent"
              ? "returned"
              : event.type === "ProofRejectedEvent"
              ? "rejected"
              : event.type === "BlockProofEvent"
              ? "block proof"
              : event.type === "ProofCalculationCreatedEvent"
              ? "new block"
              : "unknown";
          let count = "sequences" in event ? event.sequences.length : undefined;
          let startSequence =
            "start_sequence" in event
              ? Number(event.start_sequence)
              : undefined;
          let endSequence =
            "end_sequence" in event && event.end_sequence
              ? Number(event.end_sequence)
              : undefined;
          if ("sequences" in event && event.sequences.length > 0) {
            startSequence = event.sequences[0];
            endSequence = event.sequences[event.sequences.length - 1];
          }
          if (
            "start_sequence" in event &&
            "end_sequence" in event &&
            event.end_sequence
          ) {
            count = Number(event.end_sequence - event.start_sequence) + 1;
          }
          let storageHash = "da_hash" in event ? event.da_hash : undefined;
          return {
            id:
              event.digest +
              type +
              (startSequence?.toString() ?? "a") +
              (endSequence?.toString() ?? "b"),
            type,
            txHash: event.digest,
            proofCount: count,
            blockNumber: Number(event.block_number),
            storageHash: storageHash,
            sequences: "sequences" in event ? event.sequences : undefined,
            startSequence: startSequence,
            endSequence: endSequence,
            time: event.timestamp,
          };
        }) ?? []
    ).sort((a, b) => b.time - a.time);
    if (txData && "blockNumber" in txData && "sequence") {
      const txProofs = proofs.filter(
        (proof) =>
          proof.blockNumber === txData.blockNumber &&
          (("sequences" in proof &&
            proof.sequences &&
            proof.sequences.includes(txData.sequence)) ||
            ("startSequence" in proof &&
              "endSequence" in proof &&
              proof.startSequence &&
              proof.endSequence &&
              txData.sequence >= proof.startSequence &&
              txData.sequence <= proof.endSequence))
      );
      setTxProofs(txProofs);
    }

    setProofs(proofs.slice(0, 20));
  }, [proofEvents]);

  useEffect(() => {
    async function getU256Address() {
      if (!user) return;
      console.log("user", user);
      const config = await getConfig();
      console.log("config", config);
      const u256 = publicKeyToU256(user);
      setAddressU256(u256);
    }
    getU256Address();
  }, [user]);

  useEffect(() => {
    if (highlight) {
      const timer = setTimeout(() => {
        setHighlight(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [highlight]);

  useEffect(() => {
    async function getAccount() {
      console.log("addressU256", addressU256);
      if (!addressU256) return;
      const account = await fetchDexAccount({ addressU256: addressU256 });
      setAccount(account);
      console.log("account", account);
    }
    getAccount();
  }, [addressU256]);

  useEffect(() => {
    async function waitForTx(txData: LastTransactionData) {
      if (!txData?.digest) return;
      if (txData.indexTime) return;
      const start = Date.now();
      const tx = await waitTx(txData.digest);
      const end = Date.now();
      const duration = end - start;
      console.log("index delay", duration);
      setTxData((prevTxData) => {
        if (prevTxData === null) return prevTxData;
        return { ...prevTxData, indexTime: duration };
      });
    }
    if (txData !== null && (txData as any).digest) {
      waitForTx(txData as LastTransactionData);
    }
  }, [txData]);

  useEffect(() => {
    async function getAccount() {
      console.log("address", address);
      console.log("viewMode", viewMode);
      const user =
        viewMode === "sql" && ALICE_PUBLIC_KEY ? ALICE_PUBLIC_KEY : address;
      if (!user) return;
      const u256 = publicKeyToU256(user);
      const account = await fetchDexAccount({ addressU256: u256 });
      if (!account) return;
      setAddressU256(u256);
      setUser(user);
      setAccount(account);
      console.log("account", account);
    }
    getAccount();
  }, [address, txData, viewMode]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    async function pollAccount() {
      if (!addressU256) return;

      try {
        const fetchedAccount = await fetchDexAccount({
          addressU256: addressU256,
        });

        // Check if account data has changed
        let changed = false;
        if (fetchedAccount) {
          if (!account) {
            changed = true;
            if (DEBUG) console.log("Account was undefined");
          } else {
            if (
              account.baseTokenBalance.amount !==
              fetchedAccount.baseTokenBalance.amount
            ) {
              changed = true;
              if (DEBUG) console.log("Base token balance changed");
            }
            if (
              account.quoteTokenBalance.amount !==
              fetchedAccount.quoteTokenBalance.amount
            ) {
              changed = true;
              if (DEBUG) console.log("Quote token balance changed");
            }
            if (
              account.bid.amount !== fetchedAccount.bid.amount ||
              account.bid.price !== fetchedAccount.bid.price ||
              account.bid.isSome !== fetchedAccount.bid.isSome
            ) {
              changed = true;
              if (DEBUG) console.log("Bid changed");
            }
            if (
              account.ask.amount !== fetchedAccount.ask.amount ||
              account.ask.price !== fetchedAccount.ask.price ||
              account.ask.isSome !== fetchedAccount.ask.isSome
            ) {
              changed = true;
              if (DEBUG) console.log("Ask changed");
            }
          }
        }
        if (changed) {
          setAccount(fetchedAccount);
          setHighlight(true);
          if (DEBUG) console.log("Account updated:", fetchedAccount);
        } else {
          //if (DEBUG) console.log("Account not changed");
        }
      } catch (error) {
        console.error("Error polling account:", error);
      }
    }

    // Start polling every 1 second
    intervalId = setInterval(pollAccount, 1000);

    // Initial poll
    pollAccount();

    // Cleanup interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, [addressU256, account, txData]);

  async function getAddress(): Promise<string | undefined> {
    let userAddress = address;

    userAddress = (await getWalletInfo()).address;

    if (address !== userAddress) {
      setAddress(userAddress);
      if (DEBUG) console.log("address", userAddress);
    }
    setAddressValid(userAddress ? await checkAddress(userAddress) : false);
    return userAddress;
  }

  useEffect(() => {
    getAddress();
  }, []);

  useEffect(() => {
    async function fetchNetworkInfo() {
      const networkInfo = await getNetworkInfo();
      setNetworkInfo(networkInfo);
    }
    fetchNetworkInfo();
  }, [config, dexVersion]);

  useEffect(() => {
    async function getKey() {
      const key = await getUserKey({ autoReturn: true });
      setKey(key);
    }
    getKey();
  }, []);

  useEffect(() => {
    async function pingKey() {
      await pingUserKey();
    }

    const pingInterval = setInterval(pingKey, 10 * 60 * 1000); // 10 minutes

    return () => {
      clearInterval(pingInterval);
    };
  }, [key]);

  useEffect(() => {
    async function getDexConfig() {
      const config = await getConfig();
      setConfig(config);
    }
    getDexConfig();
  }, []);

  const startProcessing = (type: TransactionType) => {
    setTxData(null);
    setL1Tx(undefined);
    setTxProofs([]);
    setProcessing(type);
  };

  const createAccount = async () => {
    startProcessing("createAccount");
    if (!address) {
      setTxData({
        errors: [
          {
            code: "E0001",
            message: "No user address",
            severity: "error",
          },
        ],
      });
      setProcessing(undefined);
      return;
    }
    console.log("createAccount: address", address);
    const u256 = publicKeyToU256(address);
    const account = await fetchDexAccount({ addressU256: u256 });
    console.log("checked account", account);
    if (account) {
      setAddressU256(u256);
      setAccount(account);
    } else {
      log.info("createAccount: no account, creating account", {
        addressU256: u256.toString(),
        address,
      });
      console.log("creating account", u256, address);
      try {
        const result = await createDexAccount({ user: address, key });
        setAddressU256(u256);
        setTxData(result);
      } catch (error: any) {
        setTxData({
          errors: [
            {
              code: "E0001",
              message: error.message ?? "tx failed",
              severity: "error",
            },
          ],
        });
      }
    }
    setProcessing(undefined);
  };

  const faucet = async () => {
    startProcessing("faucet");
    if (!address) {
      setTxData({
        errors: [
          {
            code: "E0001",
            message: "No user address",
            severity: "error",
          },
        ],
      });
      return;
    }
    try {
      const result = await dexFaucet({ user: address, key });
      setTxData(result);
      if (DEBUG) console.log("result", result);
    } catch (error: any) {
      setTxData({
        errors: [
          {
            code: "E0001",
            message: error.message ?? "tx failed",
            severity: "error",
          },
        ],
      });
    } finally {
      setProcessing(undefined);
    }
  };

  const proveAccount = async () => {
    startProcessing("proveAccount");
    if (!address) {
      setTxData({
        errors: [
          {
            code: "E0001",
            message: "No user address",
            severity: "error",
          },
        ],
      });
      return;
    }
    try {
      const blockNumber = dex?.block_number;
      const sequence = dex?.sequence;
      if (!blockNumber || !sequence) {
        setTxData({
          errors: [
            {
              code: "E0001",
              message: "No block number or sequence",
              severity: "error",
            },
          ],
        });
        setProcessing(undefined);
        return;
      }
      const result = await agentProveAccount({
        address,
        blockNumber: Number(blockNumber),
        sequence: Number(sequence),
      });
      //setTxData(result);
      if (DEBUG) console.log("result", result);
      if (result?.success === undefined || result?.success === false) {
        setTxData({
          errors: [
            {
              code: "E0001",
              message: "proveAccount failed",
              severity: "error",
            },
          ],
        });
        setProcessing(undefined);
        return;
      } else {
        const jobId = result.jobId;
        console.log("jobId", jobId);
        if (!jobId) {
          setTxData({
            errors: [
              {
                code: "E0001",
                message: "proveAccount failed",
                severity: "error",
              },
            ],
          });
        } else {
          setJobId(jobId);
          let received: string | undefined = undefined;
          let failed = false;
          let result = await dexProverResult({ jobId });
          console.log("result", result?.result);
          while (!received && !failed) {
            await sleep(5000);
            result = await dexProverResult({ jobId });
            console.log("result", result?.result);
            try {
              if (result?.result) {
                const { success, blobId } = JSON.parse(result.result);
                if (success && blobId) {
                  received = blobId;
                } else {
                  failed = true;
                }
              }
            } catch (error: any) {
              console.error("Error parsing result:", error.message);
              failed = true;
              setTxData({
                errors: [
                  {
                    code: "E0001",
                    message: "proveAccount failed",
                    severity: "error",
                  },
                ],
              });
              setProcessing(undefined);
              return;
            }
          }
          if (received) {
            setProof(received);
          }
          setProcessing(undefined);
          return;
        }
      }
    } catch (error: any) {
      setTxData({
        errors: [
          {
            code: "E0001",
            message: error.message ?? "proveAccount failed",
            severity: "error",
          },
        ],
      });
    } finally {
      setProcessing(undefined);
    }
  };

  const executeOrder = async (order: OrderFormState) => {
    startProcessing(order.orderType);

    if (!address) {
      setTxData({
        errors: [
          {
            code: "E0001",
            message: "No user address",
            severity: "error",
          },
        ],
      });
      setProcessing(undefined);
      return;
    }
    const mina = (window as any).mina;
    if (mina === undefined || mina?.isAuro !== true) {
      setTxData({
        errors: [
          {
            code: "E0001",
            message: "No Auro Wallet found",
            severity: "error",
          },
        ],
      });
      setProcessing(undefined);
      return;
    }

    if (
      order.orderType !== "buy" &&
      order.orderType !== "sell" &&
      order.orderType !== "transfer" &&
      order.orderType !== "cancelBuy" &&
      order.orderType !== "cancelSell"
    ) {
      setTxData({
        errors: [
          {
            code: "E0002",
            message: `${order.orderType} orders are in development, check back soon!`,
            severity: "error",
          },
        ],
      });
      setProcessing(undefined);
      return;
    }

    let amount =
      order.amount !== undefined && order.amount !== ""
        ? Number(order.amount)
        : undefined;
    let price =
      order.price !== undefined && order.price !== ""
        ? Number(order.price)
        : undefined;

    if (amount === undefined) {
      setTxData({
        errors: [
          {
            code: "E0003",
            message: `Amount is required for ${order.orderType} orders`,
            severity: "error",
          },
        ],
      });
      setProcessing(undefined);
      return;
    }

    if (
      price === undefined &&
      (order.orderType === "buy" ||
        order.orderType === "sell" ||
        order.orderType === "cancelBuy" ||
        order.orderType === "cancelSell")
    ) {
      setTxData({
        errors: [
          {
            code: "E0004",
            message: `Price is required for ${order.orderType} orders`,
            severity: "error",
          },
        ],
      });
      setProcessing(undefined);
      return;
    }

    if (!order.recipient && order.orderType === "transfer") {
      setTxData({
        errors: [
          {
            code: "E0005",
            message: `Recipient is required for transfer orders`,
            severity: "error",
          },
        ],
      });
      setProcessing(undefined);
      return;
    }

    let type: TransactionType = order.orderType;
    if (order.orderType === "cancelBuy") type = "buy";
    if (order.orderType === "cancelSell") type = "sell";

    try {
      const orderPayload = await prepareOrderPayload({
        user: address,
        amount,
        price,
        recipient: order.recipient,
        type,
        currency: order.transferCurrency ?? "WETH",
      });
      const { signature, publicKey } = await mina?.signFields({
        message: orderPayload.payload.map((p: bigint) => p.toString()),
      });
      if (DEBUG) console.log("Transaction result", { signature, publicKey });
      if (!signature) {
        setTxData({
          errors: [
            {
              code: "E0007",
              message: "No signature received",
              severity: "error",
            },
          ],
        });
        setProcessing(undefined);
      }
      if (!publicKey) {
        setTxData({
          errors: [
            {
              code: "E0008",
              message: "No public key received",
              severity: "error",
            },
          ],
        });
        setProcessing(undefined);
        return;
      }
      if (publicKey !== address) {
        setTxData({
          errors: [
            {
              code: "E0009",
              message: "Signed using wrong address",
              severity: "error",
            },
          ],
        });
        setProcessing(undefined);
        return;
      }
      const result = await orderWithPayload({
        signature,
        payload: orderPayload,
        key,
      });

      setTxData(result);

      if (DEBUG) console.log("result", result);
    } catch (error: any) {
      setTxData({
        errors: [
          {
            code: "E0010",
            message: error.message ?? "tx failed",
            severity: "error",
          },
        ],
      });
    } finally {
      setProcessing(undefined);
    }
  };

  useEffect(() => {
    const fetchPrice = async () => {
      const data = await getEthPrice();
      if (data?.price) setPrice(data.price);
      if (data?.change) {
        if (data.change > 0) {
          setPriceDirection("up");
          setChange(data.change);
        } else {
          setPriceDirection("down");
          setChange(-data.change);
        }
      }
    };
    fetchPrice();
  }, []);

  async function fetchWalletInfo(): Promise<{
    address: string | undefined;
    network: string | undefined;
  }> {
    const walletInfo = await getWalletInfo();
    setAddress(walletInfo.address);
    return walletInfo;
  }

  useEffect(() => {
    fetchWalletInfo();
  }, []);

  async function connect() {
    const address = (await connectWallet()).address;
    setAddress(address);
  }

  return (
    <div className="flex flex-col  h-screen bg-[#0b0e11] text-white overflow-hidden">
      {/* Professional Header with price and absolute change */}
      <header className="flex items-center justify-between px-3 py-1 bg-[#161a1e] border-b border-[#2a2e37]">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <Image
              src="/img/silvana.png"
              alt="Silvana DEX"
              width={32}
              height={32}
              className="mr-2"
            />
            <h1 className="text-lg font-bold bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
              Silvana DEX
            </h1>
          </div>
          {price && change && (
            <div className="flex items-center">
              <div className="text-white text-sm font-medium mr-2">
                WETH/WUSD
              </div>
              <div className="flex items-center">
                <div className="text-white text-sm font-medium mr-1">
                  {formatPrice(price, 6)}
                </div>
                {priceDirection === "up" ? (
                  <div className="text-[#02c076] text-xs flex items-center">
                    <span className="mr-0.5">▲</span>
                    <span>{formatPrice(change, 3)}%</span>
                  </div>
                ) : (
                  <div className="text-[#f6465d] text-xs flex items-center">
                    <span className="mr-0.5">▼</span>
                    <span>{formatPrice(change, 3)}%</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center">
          <div className="flex items-center mr-4">
            <a
              href={"https://silvascan.io/testnet/home"}
              target="_blank"
              rel="noopener noreferrer"
              className="mr-2 text-sm bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent hover:opacity-80 transition-opacity"
            >
              Silvascan
            </a>
          </div>
          {user || address ? (
            <div className="flex items-center">
              <div className="flex items-center bg-[#2a2e37] rounded-lg px-2 py-0.5 text-xs">
                <span className="text-[#848e9c] mr-1">
                  {viewMode === "sql" ? "Alice:" : "Connected:"}
                </span>
                <span className="text-white">
                  {shortenString(user ?? address, 12)}
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={connect}
              className="bg-accent hover:bg-accent-dark rounded-lg px-3 py-0.5 text-xs transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      {/* Main Trading Interface */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Column - Chart, Orderbook, and Market Trades */}
        <div className="w-2/5 flex flex-col border-r border-[#2a2e37]">
          {/* Trading Chart */}
          {/* View Mode Switch */}
          <div className="flex justify-between items-center px-1 py-0.5 bg-[#161a1e] border-b border-[#2a2e37]">
            <div className="flex items-center">
              <div className="flex border border-[#2a2e37] rounded-lg overflow-hidden text-[11px]">
                <button
                  className={`px-3 py-0.5 ${
                    viewMode === "chart"
                      ? "bg-[#1E80FF] text-white"
                      : "bg-[#2a2e37] text-[#848e9c] hover:bg-[#3a3e47]"
                  } transition-colors font-medium`}
                  onClick={() => setViewMode("chart")}
                >
                  Chart
                </button>
                <button
                  className={`px-3 py-0.5 ${
                    viewMode === "sql"
                      ? "bg-[#1E80FF] text-white"
                      : "bg-[#2a2e37] text-[#848e9c] hover:bg-[#3a3e47]"
                  } transition-colors font-medium`}
                  onClick={() => setViewMode("sql")}
                >
                  SQL
                </button>
              </div>

              {/* Block and Sequence dropdowns - Made smaller */}
              {viewMode === "sql" && (
                <div className="flex ml-4 space-x-1 items-center">
                  <div className="text-[10px] text-[#848e9c] mr-0.5">
                    {`Block: ${displayedBlockNumber}`}
                  </div>
                  <div className="w-10">
                    <select
                      value={displayedBlockNumber}
                      onChange={(e) => setBlockNumber(Number(e.target.value))}
                      className="w-8 bg-[#2a2e37] border border-[#3a3e47] rounded px-1 text-[10px] text-center focus:border-accent focus:outline-none h-6 flex items-center justify-center"
                    >
                      {blockOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-[10px] text-[#848e9c] ml-1 mr-0.5">
                    {`Sequence: ${displayedSequence}`}
                  </div>
                  <div className="w-10">
                    <select
                      value={displayedSequence}
                      onChange={(e) => setSequence(Number(e.target.value))}
                      className="w-8 bg-[#2a2e37] border border-[#3a3e47] rounded px-1 text-[10px] text-center focus:border-accent focus:outline-none h-6 flex items-center justify-center"
                    >
                      {sequenceOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-1 items-center">
                    <div className="text-[10px] text-[#848e9c] mr-0.5">
                      Price:
                    </div>
                    <input
                      type="text"
                      value={sqlPrice || ""}
                      onChange={(e) =>
                        setSqlPrice(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="mr-2 w-16 bg-[#2a2e37] border border-[#3a3e47] rounded px-1 text-[10px] text-white focus:border-accent focus:outline-none h-6"
                      placeholder="Price"
                    />
                    <div className="text-[10px] text-[#848e9c] ml-1 mr-0.5">
                      Amount:
                    </div>
                    <input
                      type="text"
                      value={sqlAmount || ""}
                      onChange={(e) =>
                        setSqlAmount(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                      className="w-16 bg-[#2a2e37] border border-[#3a3e47] rounded px-1 text-[10px] text-white focus:border-accent focus:outline-none h-6"
                      placeholder="Amount"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Trading Chart or SQL Query */}
          <div className="h-[calc(2/5*100%-24px)] border-b border-[#2a2e37] bg-[#161a1e]">
            {viewMode === "chart" ? (
              <TradingChart />
            ) : (
              <SqlQuery
                blockNumber={
                  blockNumber ?? dex?.block_number
                    ? Number(dex?.block_number)
                    : 1
                }
                sequence={
                  sequence ?? (dex?.sequence ? Number(dex?.sequence) : 1)
                }
                price={sqlPrice}
                amount={sqlAmount}
                setTxData={setTxData}
              />
            )}
          </div>

          {/* Middle section with Order Book and Market Trades */}
          <div className="h-2/5 flex border-b border-[#2a2e37] bg-[#161a1e]">
            {/* Order Book */}
            <div className="w-1/2 border-r border-[#2a2e37] overflow-hidden">
              <OrderBook orderbook={orderbook} account={account} />
            </div>

            {/* Market Trades */}
            <div className="w-1/2 overflow-hidden">
              <MarketTrades trades={trades} />
            </div>
          </div>

          {/* Last Orders - Now under Market Trades */}
          <div className="h-1/5 bg-[#161a1e] overflow-hidden">
            <LastOrders orders={orders} />
          </div>
        </div>

        {/* Right Column - Trading Form and Info */}
        <div className="w-3/5 flex flex-col">
          {/* Trading Form and User Account - Now 2/5 height to match chart */}
          <div className="flex h-2/5 border-b border-[#2a2e37]">
            {/* Trading Form */}
            <div className="w-1/2 border-r border-[#2a2e37] bg-[#161a1e] p-1">
              <OrderForm
                orderType={orderType}
                setOrderType={setOrderType}
                address={address}
                processing={processing}
                executeOrder={executeOrder}
                marketPrice={price}
                account={account}
              />
            </div>

            {/* User Account Section - Now with Open Orders above Wallet Balance */}
            <div className="w-1/2 flex flex-col bg-[#161a1e] p-1 space-y-1">
              {/* Open Orders - Takes 1/3 of the height */}
              <div className="h-1/3">
                <OpenOrders
                  account={account}
                  address={address}
                  processing={processing}
                  executeOrder={executeOrder}
                />
              </div>

              {/* Wallet Balance - Takes 2/3 of the height */}
              <div className="h-2/3">
                <UserAccount
                  account={account}
                  pendingTransactions={pendingTransactions}
                  highlight={highlight}
                  faucet={faucet}
                  processing={processing}
                  createAccount={createAccount}
                  proveAccount={proveAccount}
                  proof={proof}
                  jobId={jobId}
                />
              </div>
            </div>
          </div>

          {/* Bottom Panels - Now 3/5 height to fill remaining space */}
          <div className="h-3/5 flex flex-col gap-0.5 p-0.5 overflow-hidden bg-[#0b0e11]">
            {/* Row 1: Your Last Transaction and Last Proofs side by side */}
            <div className="flex gap-0.5 h-1/2">
              <div className="bg-[#161a1e] rounded overflow-hidden w-1/2">
                <LastTransaction txData={txData} proofs={txProofs} tx={l1Tx} />
              </div>
              <div className="bg-[#161a1e] rounded overflow-hidden w-1/2">
                <LastProofs proofs={proofs} />
              </div>
            </div>

            {/* Row 2: Network Info and Last L1 Txs with equal widths */}
            <div className="flex gap-0.5 h-1/2">
              <div className="bg-[#161a1e] rounded overflow-hidden w-1/2">
                <NetworkInfo networkInfo={networkInfo} />
              </div>
              <div className="bg-[#161a1e] rounded overflow-hidden w-1/2">
                <LastL1Txs transactions={l1Events} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
