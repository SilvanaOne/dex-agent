"use client";

import { useState, useEffect } from "react";
import { shortenString } from "@/lib/short";
import { MinaTransactionEvent } from "@dex-agent/lib";
import { formatTime } from "@/lib/format";
import { daUrl, explorerTransactionUrl } from "@/lib/chain";

export default function LastL1Txs({
  transactions = [],
}: {
  transactions?: MinaTransactionEvent[];
}) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full p-1 flex flex-col">
      <h3 className="text-sm font-semibold mb-0.5 text-[#02c076]">
        Last Settlement Transactions
      </h3>

      <div className="grid grid-cols-7 text-[9px] text-[#848e9c] mb-0.5 font-medium">
        <div>Tx Hash</div>
        <div className="text-center">Block</div>
        <div className="text-center">State DA</div>
        <div className="text-center">Proof DA</div>
        <div className="text-center">Tx Count</div>
        <div className="text-center">Txs</div>
        <div className="text-right">Time</div>
      </div>

      <div className="overflow-hidden max-h-[calc(100%-18px)] flex-1">
        {transactions.map((tx) => (
          <div
            key={tx.digest}
            className="grid grid-cols-7 text-[9px] hover:bg-[#2a2e37] transition-colors"
          >
            <div className="truncate text-[#02c076]">
              <a
                href={explorerTransactionUrl() + (tx.mina_tx_hash ?? "")}
                className="text-accent hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortenString(tx.mina_tx_hash, 4)}
              </a>
            </div>
            <div className="text-center">{tx.block_number}</div>
            <div className="truncate text-[#848e9c] text-center">
              <a
                href={daUrl(tx.state_data_availability ?? "")}
                className="text-accent hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortenString(tx.state_data_availability, 10)}
              </a>
            </div>
            <div className="text-center text-[#848e9c]">
              <a
                href={daUrl(tx.proof_data_availability ?? "")}
                className="text-accent hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortenString(tx.proof_data_availability ?? "", 10)}
              </a>
            </div>
            <div className="text-center">
              {Number(tx.end_sequence - tx.start_sequence) + 1}
            </div>
            <div className="text-center text-[#848e9c]">
              {tx.start_sequence && tx.end_sequence
                ? tx.start_sequence === tx.end_sequence
                  ? tx.start_sequence
                  : `${tx.start_sequence} - ${tx.end_sequence}`
                : ""}
            </div>
            <div className="text-right text-[#848e9c]">
              {formatTime(tx.timestamp, currentTime)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function generateRandomHash(): string {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 16; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}
