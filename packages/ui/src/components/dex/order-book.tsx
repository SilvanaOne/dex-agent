"use client";

import { useState, useEffect } from "react";
import { Orderbook, UserTradingAccount } from "@dex-agent/lib";

export default function OrderBookComponent({
  orderbook,
  account,
}: {
  orderbook?: Orderbook;
  account?: UserTradingAccount;
}) {
  const bids = orderbook
    ? Object.entries(orderbook.sorted_bids).map(
        ([price, { amount, total }]) => ({
          price: Number(BigInt(price) / 1_000_000n) / 1000,
          amount: Number(amount / 1_000_000n) / 1000,
          total: Number(total / 1_000_000n) / 1000,
          user: account?.bid?.price === BigInt(price),
        })
      )
    : [];
  const asks = (
    orderbook
      ? Object.entries(orderbook.sorted_offers).map(
          ([price, { amount, total }]) => ({
            price: Number(BigInt(price) / 1_000_000n) / 1000,
            amount: Number(amount / 1_000_000n) / 1000,
            total: Number(total / 1_000_000n) / 1000,
            user: account?.ask?.price === BigInt(price),
          })
        )
      : []
  ).reverse();
  const spread: { amount: number; percentage: number } | undefined =
    orderbook && orderbook.highest_bid && orderbook.lowest_offer
      ? {
          amount:
            Number(
              (orderbook.lowest_offer - orderbook.highest_bid) / 1_000_000n
            ) / 1000,
          percentage:
            (Number(
              (orderbook.lowest_offer - orderbook.highest_bid) / 1_000_000n
            ) /
              Number(orderbook.highest_bid / 1_000_000n)) *
            100,
        }
      : undefined;

  const [depthView, setDepthView] = useState<"0.01" | "0.1" | "1.0">("0.01");

  return (
    <div className="h-full p-1 flex flex-col">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-semibold text-white">Order Book</h3>
        <div className="flex space-x-1 text-[10px]">
          <button
            className={`px-1 py-0.5 rounded ${
              depthView === "0.01"
                ? "bg-accent text-white"
                : "bg-[#2a2e37] text-[#848e9c] hover:bg-[#3a3e47]"
            } transition-colors`}
            onClick={() => setDepthView("0.01")}
          >
            0.01
          </button>
          <button
            className={`px-1 py-0.5 rounded ${
              depthView === "0.1"
                ? "bg-accent text-white"
                : "bg-[#2a2e37] text-[#848e9c] hover:bg-[#3a3e47]"
            } transition-colors`}
            onClick={() => setDepthView("0.1")}
          >
            0.1
          </button>
          <button
            className={`px-1 py-0.5 rounded ${
              depthView === "1.0"
                ? "bg-accent text-white"
                : "bg-[#2a2e37] text-[#848e9c] hover:bg-[#3a3e47]"
            } transition-colors`}
            onClick={() => setDepthView("1.0")}
          >
            1.0
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 text-[10px] text-[#848e9c] mb-0.5 font-medium">
        <div>Price</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Total</div>
      </div>

      {/* Asks (Sell Orders) */}
      <div className="overflow-hidden mb-1 max-h-[calc(50%-20px)]">
        {asks.map((ask, index) => (
          <div
            key={`ask-${index}`}
            className="grid grid-cols-3 text-[10px] hover:bg-[#2a2e37] transition-colors relative"
          >
            <div
              className={`${
                ask.user ? "font-semibold text-2xs" : ""
              } text-[#f6465d] z-10`}
            >
              {ask.price.toFixed(2)}
            </div>
            <div className="text-right z-10">{ask.amount.toFixed(4)}</div>
            <div className="text-right z-10">{ask.total.toFixed(4)}</div>
            <div
              className="absolute right-0 top-0 h-full bg-[#2c2431] opacity-20"
              style={{
                width: `${(ask.total / asks[asks.length - 1].total) * 100}%`,
              }}
            ></div>
          </div>
        ))}
      </div>

      {/* Spread */}
      {spread && (
        <div className="text-center text-[10px] py-0.5 border-y border-[#2a2e37] text-[#848e9c] font-medium">
          Spread: <span className="text-white">{spread.amount}</span> (
          <span className="text-white">{spread.percentage.toFixed(2)}%</span>)
        </div>
      )}

      {/* Bids (Buy Orders) */}
      <div className="overflow-hidden mt-1 max-h-[calc(50%-20px)]">
        {bids.map((bid, index) => (
          <div
            key={`bid-${index}`}
            className="grid grid-cols-3 text-[10px] hover:bg-[#2a2e37] transition-colors relative"
          >
            <div
              className={`${
                bid.user ? "font-semibold text-2xs" : ""
              } text-[#02c076] z-10`}
            >
              {bid.price.toFixed(2)}
            </div>
            <div className="text-right z-10">{bid.amount.toFixed(4)}</div>
            <div className="text-right z-10">{bid.total.toFixed(4)}</div>
            <div
              className="absolute right-0 top-0 h-full bg-[#1c3131] opacity-20"
              style={{
                width: `${(bid.total / bids[bids.length - 1].total) * 100}%`,
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
