"use client";

import { useState, useEffect } from "react";
import { formatTime } from "@/lib/format";

export interface Trade {
  id: number;
  price: number;
  amount: number;
  value: number;
  time: number;
  type: "up" | "down";
}

export function MarketTrades({ trades }: { trades: Trade[] }) {
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full p-1 flex flex-col">
      <h3 className="text-sm font-semibold mb-1 text-white">Market Trades</h3>

      <div className="grid grid-cols-3 text-[10px] text-[#848e9c] mb-0.5 font-medium">
        <div>Price</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Time</div>
      </div>

      <div className="overflow-hidden max-h-[calc(100%-20px)] flex-1">
        {trades.map((trade) => (
          <div
            key={trade.id}
            className="grid grid-cols-3 text-[10px] hover:bg-[#2a2e37] transition-colors"
          >
            <div
              className={
                trade.type === "up" ? "text-[#02c076]" : "text-[#f6465d]"
              }
            >
              {trade.price.toFixed(2)}
            </div>
            <div className="text-right">{trade.amount.toFixed(4)}</div>
            <div className="text-right text-[#848e9c]">
              {formatTime(trade.time, currentTime)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
