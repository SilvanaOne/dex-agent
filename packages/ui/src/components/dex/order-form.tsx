"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type {
  TransactionType,
  OrderFormState,
  UserTradingAccount,
} from "@dex-agent/lib";
import Processing from "@/components/dex/ui/processing";
import { formatBalance } from "@/lib/format";

export interface OrderFormProps {
  orderType: TransactionType;
  setOrderType: (type: TransactionType) => void;
  address: string | undefined;
  marketPrice: number | undefined;
  account: UserTradingAccount | undefined;
  processing: TransactionType | undefined;
  executeOrder: (order: OrderFormState) => void;
}

export function OrderForm({
  orderType,
  setOrderType,
  address,
  account,
  processing,
  executeOrder,
  marketPrice,
}: OrderFormProps) {
  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState<string | undefined>(
    marketPrice?.toString()
  );
  const [recipient, setRecipient] = useState<string>("");
  const [collateral, setCollateral] = useState<string>("");
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [transferCurrency, setTransferCurrency] = useState<"WETH" | "WUSD">(
    "WETH"
  );
  const [stakeCurrency, setStakeCurrency] = useState<"WETH" | "WUSD">("WETH");
  const [borrowCurrency, setBorrowCurrency] = useState<"WETH" | "WUSD">("WETH");

  useEffect(() => {
    if (marketPrice) {
      setPrice((prev) => {
        if (prev === undefined) {
          return marketPrice.toString();
        }
        return prev;
      });
    }
  }, [marketPrice]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
    setSliderValue(value);

    // Calculate amount based on slider percentage and currency
    if (orderType === "buy" || orderType === "sell") {
      const maxAmount =
        orderType === "buy"
          ? (account?.quoteTokenBalance.amount ?? 0n) /
            BigInt(Number.parseInt(price ?? marketPrice?.toString() ?? "2000"))
          : account?.baseTokenBalance.amount;
      setAmount(formatBalance(((maxAmount ?? 0n) * BigInt(value)) / 100n));
    } else if (orderType === "stake") {
      const maxAmount =
        stakeCurrency === "WETH"
          ? account?.baseTokenBalance.amount
          : account?.quoteTokenBalance.amount;
      setAmount(formatBalance(((maxAmount ?? 0n) * BigInt(value)) / 100n));
    } else if (orderType === "borrow") {
      const maxAmount =
        borrowCurrency === "WETH"
          ? (account?.quoteTokenBalance.amount ?? 0n) /
            BigInt(Number.parseInt(marketPrice?.toString() ?? "2000"))
          : (account?.baseTokenBalance.amount ?? 0n) *
            BigInt(Number.parseInt(marketPrice?.toString() ?? "2000"));
      setAmount(formatBalance(((maxAmount ?? 0n) * BigInt(value)) / 100n / 2n));
    } else if (orderType === "transfer") {
      const maxAmount =
        transferCurrency === "WETH"
          ? account?.baseTokenBalance.amount
          : account?.quoteTokenBalance.amount;
      setAmount(formatBalance(((maxAmount ?? 0n) * BigInt(value)) / 100n));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", {
      orderType,
      amount,
      price,
      recipient,
      transferCurrency: orderType === "transfer" ? transferCurrency : undefined,
      stakeCurrency: orderType === "stake" ? stakeCurrency : undefined,
      borrowCurrency: orderType === "borrow" ? borrowCurrency : undefined,
      collateral: orderType === "borrow" ? collateral : undefined,
    });
    executeOrder({
      orderType,
      amount,
      price,
      recipient,
      collateral,
      transferCurrency: orderType === "transfer" ? transferCurrency : undefined,
      stakeCurrency: orderType === "stake" ? stakeCurrency : undefined,
      borrowCurrency: orderType === "borrow" ? borrowCurrency : undefined,
    });
    // Here you would call your order execution function
  };

  // Helper function to get available balance text based on currency
  const getAvailableBalance = (currency: "WETH" | "WUSD") => {
    const amountBigInt =
      currency === "WETH"
        ? account?.baseTokenBalance.amount
        : account?.quoteTokenBalance.amount;
    return formatBalance(amountBigInt);
  };

  // Helper function to calculate estimated APY based on currency
  const getEstimatedAPY = (currency: "WETH" | "WUSD") => {
    return currency === "WETH" ? "5.2%" : "3.8%";
  };

  // Get button colors based on order type
  const getButtonColors = (type: TransactionType) => {
    switch (type) {
      case "buy":
        return "bg-[#02c076] hover:bg-[#02a76a] text-white";
      case "sell":
        return "bg-[#f6465d] hover:bg-[#e0364d] text-white";
      case "transfer":
        return "bg-[#1E80FF] hover:bg-[#1a70e0] text-white";
      case "stake":
        return "bg-[#f0b90b] hover:bg-[#d9a70a] text-white";
      case "borrow":
        return "bg-[#f7931a] hover:bg-[#e08016] text-white";
      default:
        return "bg-[#2a2e37] text-[#848e9c]";
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Tabs - Professional styling */}
      <div className="flex mb-1 border border-[#2a2e37] rounded-lg overflow-hidden text-[11px]">
        <button
          className={`flex-1 py-1 text-center ${
            orderType === "buy"
              ? "bg-[#02c076] text-white"
              : "bg-[#2a2e37] text-[#848e9c] hover:bg-[#3a3e47]"
          } transition-colors font-medium`}
          onClick={() => setOrderType("buy")}
        >
          Buy
        </button>
        <button
          className={`flex-1 py-1 text-center ${
            orderType === "sell"
              ? "bg-[#f6465d] text-white"
              : "bg-[#2a2e37] text-[#848e9c] hover:bg-[#3a3e47]"
          } transition-colors font-medium`}
          onClick={() => setOrderType("sell")}
        >
          Sell
        </button>
        <button
          className={`flex-1 py-1 text-center ${
            orderType === "transfer"
              ? "bg-[#1E80FF] text-white"
              : "bg-[#2a2e37] text-[#848e9c] hover:bg-[#3a3e47]"
          } transition-colors font-medium`}
          onClick={() => setOrderType("transfer")}
        >
          Transfer
        </button>
        <button
          className={`flex-1 py-1 text-center ${
            orderType === "stake"
              ? "bg-[#f0b90b] text-white"
              : "bg-[#2a2e37] text-[#848e9c] hover:bg-[#3a3e47]"
          } transition-colors font-medium`}
          onClick={() => setOrderType("stake")}
        >
          Stake
        </button>
        <button
          className={`flex-1 py-1 text-center ${
            orderType === "borrow"
              ? "bg-[#f7931a] text-white"
              : "bg-[#2a2e37] text-[#848e9c] hover:bg-[#3a3e47]"
          } transition-colors font-medium`}
          onClick={() => setOrderType("borrow")}
        >
          Borrow
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto">
          {/* Buy/Sell Form - Professional styling */}
          {(orderType === "buy" || orderType === "sell") && (
            <>
              <div className="mb-0.5">
                <label className="block text-[10px] text-[#848e9c] mb-0.5">
                  Price (WUSD)
                </label>
                <input
                  type="text"
                  className="w-full bg-[#2a2e37] border border-[#3a3e47] rounded py-0.5 px-1 text-white text-[10px] focus:border-accent focus:outline-none"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="mb-0.5">
                <label className="block text-[10px] text-[#848e9c] mb-0.5">
                  Amount (WETH)
                </label>
                <input
                  type="text"
                  className="w-full bg-[#2a2e37] border border-[#3a3e47] rounded py-0.5 px-1 text-white text-[10px] focus:border-accent focus:outline-none"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="mb-0.5">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  className="w-full h-0.5 appearance-none bg-[#3a3e47] rounded-full"
                  style={{
                    accentColor: orderType === "buy" ? "#02c076" : "#f6465d",
                  }}
                />
                <div className="flex justify-between text-[9px] text-[#848e9c] mt-0.5">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="mb-0.5">
                <label className="block text-[10px] text-[#848e9c] mb-0.5">
                  Total (WUSD)
                </label>
                <input
                  type="text"
                  className="w-full bg-[#2a2e37] border border-[#3a3e47] rounded py-0.5 px-1 text-white text-[10px] focus:border-accent focus:outline-none"
                  placeholder="0.00"
                  value={
                    amount && price
                      ? (
                          Number.parseFloat(amount) * Number.parseFloat(price)
                        ).toFixed(2)
                      : ""
                  }
                  readOnly
                />
              </div>
            </>
          )}

          {/* Transfer Form - Professional styling */}
          {orderType === "transfer" && (
            <>
              {/* Currency Selection */}
              <div className="mb-0.5">
                <label className="block text-[10px] text-[#848e9c] mb-0.5">
                  Currency
                </label>
                <div className="flex border border-[#3a3e47] rounded overflow-hidden">
                  <button
                    type="button"
                    className={`flex-1 py-0.5 text-[10px] ${
                      transferCurrency === "WETH"
                        ? "bg-[#1E80FF] text-white"
                        : "bg-[#2a2e37] text-[#848e9c]"
                    }`}
                    onClick={() => {
                      setTransferCurrency("WETH");
                      setAmount(""); // Reset amount when changing currency
                      setSliderValue(0);
                    }}
                  >
                    WETH
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-0.5 text-[10px] ${
                      transferCurrency === "WUSD"
                        ? "bg-[#1E80FF] text-white"
                        : "bg-[#2a2e37] text-[#848e9c]"
                    }`}
                    onClick={() => {
                      setTransferCurrency("WUSD");
                      setAmount(""); // Reset amount when changing currency
                      setSliderValue(0);
                    }}
                  >
                    WUSD
                  </button>
                </div>
              </div>

              <div className="mb-0.5">
                <label className="block text-[10px] text-[#848e9c] mb-0.5">
                  Recipient
                </label>
                <input
                  type="text"
                  className="w-full bg-[#2a2e37] border border-[#3a3e47] rounded py-0.5 px-1 text-white text-[10px] focus:border-accent focus:outline-none"
                  placeholder="B62..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
              </div>

              <div className="mb-0.5">
                <label className="block text-[10px] text-[#848e9c] mb-0.5">
                  Amount ({transferCurrency})
                </label>
                <input
                  type="text"
                  className="w-full bg-[#2a2e37] border border-[#3a3e47] rounded py-0.5 px-1 text-white text-[10px] focus:border-accent focus:outline-none"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="mb-0.5">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  className="w-full h-0.5 appearance-none bg-[#3a3e47] rounded-full"
                  style={{ accentColor: "#1E80FF" }}
                />
                <div className="flex justify-between text-[9px] text-[#848e9c] mt-0.5">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="mb-0.5">
                <div className="flex justify-between text-[9px] text-[#848e9c]">
                  <span>Available:</span>
                  <span>
                    {getAvailableBalance(transferCurrency)} {transferCurrency}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Stake Form - Professional styling */}
          {orderType === "stake" && (
            <>
              {/* Currency Selection */}
              <div className="mb-0.5">
                <label className="block text-[10px] text-[#848e9c] mb-0.5">
                  Currency
                </label>
                <div className="flex border border-[#3a3e47] rounded overflow-hidden">
                  <button
                    type="button"
                    className={`flex-1 py-0.5 text-[10px] ${
                      stakeCurrency === "WETH"
                        ? "bg-[#f0b90b] text-white"
                        : "bg-[#2a2e37] text-[#848e9c]"
                    }`}
                    onClick={() => {
                      setStakeCurrency("WETH");
                      setAmount(""); // Reset amount when changing currency
                      setSliderValue(0);
                    }}
                  >
                    WETH
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-0.5 text-[10px] ${
                      stakeCurrency === "WUSD"
                        ? "bg-[#f0b90b] text-white"
                        : "bg-[#2a2e37] text-[#848e9c]"
                    }`}
                    onClick={() => {
                      setStakeCurrency("WUSD");
                      setAmount(""); // Reset amount when changing currency
                      setSliderValue(0);
                    }}
                  >
                    WUSD
                  </button>
                </div>
              </div>

              <div className="mb-0.5">
                <label className="block text-[10px] text-[#848e9c] mb-0.5">
                  Amount ({stakeCurrency})
                </label>
                <input
                  type="text"
                  className="w-full bg-[#2a2e37] border border-[#3a3e47] rounded py-0.5 px-1 text-white text-[10px] focus:border-accent focus:outline-none"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="mb-0.5">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  className="w-full h-0.5 appearance-none bg-[#3a3e47] rounded-full"
                  style={{ accentColor: "#f0b90b" }}
                />
                <div className="flex justify-between text-[9px] text-[#848e9c] mt-0.5">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="mb-0.5">
                <div className="flex justify-between text-[9px] text-[#848e9c]">
                  <span>Available:</span>
                  <span>
                    {getAvailableBalance(stakeCurrency)} {stakeCurrency}
                  </span>
                </div>
              </div>

              <div className="mb-0.5">
                <label className="block text-[10px] text-[#848e9c] mb-0.5">
                  Estimated APY
                </label>
                <div className="w-full bg-[#2a2e37] border border-[#3a3e47] rounded py-0.5 px-1 text-white text-[10px]">
                  {getEstimatedAPY(stakeCurrency)}
                </div>
              </div>
            </>
          )}

          {/* Borrow Form - Professional styling */}
          {orderType === "borrow" && (
            <>
              {/* Currency Selection */}
              <div className="mb-0.5">
                <label className="block text-[10px] text-[#848e9c] mb-0.5">
                  Currency
                </label>
                <div className="flex border border-[#3a3e47] rounded overflow-hidden">
                  <button
                    type="button"
                    className={`flex-1 py-0.5 text-[10px] ${
                      borrowCurrency === "WETH"
                        ? "bg-[#f7931a] text-white"
                        : "bg-[#2a2e37] text-[#848e9c]"
                    }`}
                    onClick={() => {
                      setBorrowCurrency("WETH");
                      setAmount(""); // Reset amount when changing currency
                      setCollateral(""); // Reset collateral
                      setSliderValue(0);
                    }}
                  >
                    WETH
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-0.5 text-[10px] ${
                      borrowCurrency === "WUSD"
                        ? "bg-[#f7931a] text-white"
                        : "bg-[#2a2e37] text-[#848e9c]"
                    }`}
                    onClick={() => {
                      setBorrowCurrency("WUSD");
                      setAmount(""); // Reset amount when changing currency
                      setCollateral(""); // Reset collateral
                      setSliderValue(0);
                    }}
                  >
                    WUSD
                  </button>
                </div>
              </div>

              <div className="mb-0.5">
                <label className="block text-[10px] text-[#848e9c] mb-0.5">
                  Borrow Amount ({borrowCurrency})
                </label>
                <input
                  type="text"
                  className="w-full bg-[#2a2e37] border border-[#3a3e47] rounded py-0.5 px-1 text-white text-[10px] focus:border-accent focus:outline-none"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="mb-0.5">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  className="w-full h-0.5 appearance-none bg-[#3a3e47] rounded-full"
                  style={{ accentColor: "#f7931a" }}
                />
                <div className="flex justify-between text-[9px] text-[#848e9c] mt-0.5">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="mb-0.5">
                <label className="block text-[10px] text-[#848e9c] mb-0.5">
                  Collateral ({borrowCurrency === "WETH" ? "WUSD" : "WETH"})
                </label>
                <input
                  type="text"
                  className="w-full bg-[#2a2e37] border border-[#3a3e47] rounded py-0.5 px-1 text-white text-[10px] focus:border-accent focus:outline-none"
                  placeholder="0.00"
                  value={collateral}
                  onChange={(e) => setCollateral(e.target.value)}
                />
              </div>

              <div className="mb-0.5">
                <label className="block text-[10px] text-[#848e9c] mb-0.5">
                  Collateral Ratio
                </label>
                <div className="w-full bg-[#2a2e37] border border-[#3a3e47] rounded py-0.5 px-1 text-white text-[10px]">
                  {amount && collateral
                    ? borrowCurrency === "WETH"
                      ? `${(
                          (Number.parseFloat(collateral) /
                            (Number.parseFloat(amount) * 2000)) *
                          100
                        ).toFixed(2)}%`
                      : `${(
                          ((Number.parseFloat(collateral) * 2000) /
                            Number.parseFloat(amount)) *
                          100
                        ).toFixed(2)}%`
                    : "0.00%"}
                </div>
                <div className="text-[7px] text-[#848e9c] mt-0.5">
                  Minimum required: 150%
                </div>
              </div>
            </>
          )}
        </div>

        {/* Submit Button - Professional styling */}
        <button
          type="submit"
          disabled={processing !== undefined}
          className={`mt-1 h-9 w-full rounded-lg text-[12px] font-semibold ${getButtonColors(
            orderType
          )} transition-colors flex items-center justify-center`}
        >
          {processing === orderType ? (
            <>
              <Processing />
              {orderType === "buy"
                ? "Buying WETH..."
                : orderType === "sell"
                ? "Selling WETH..."
                : orderType === "transfer"
                ? `Transferring ${transferCurrency}...`
                : orderType === "stake"
                ? `Staking ${stakeCurrency}...`
                : `Borrowing ${borrowCurrency}...`}
            </>
          ) : orderType === "buy" ? (
            "Buy WETH"
          ) : orderType === "sell" ? (
            "Sell WETH"
          ) : orderType === "transfer" ? (
            `Transfer ${transferCurrency}`
          ) : orderType === "stake" ? (
            `Stake ${stakeCurrency}`
          ) : (
            `Borrow ${borrowCurrency}`
          )}
        </button>
      </form>
    </div>
  );
}
