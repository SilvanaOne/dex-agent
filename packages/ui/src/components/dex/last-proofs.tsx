"use client";

import { useState, useEffect } from "react";
import { shortenString } from "@/lib/short";
import { formatTime } from "@/lib/format";
import { daUrl, suiExplorerTxUrl } from "@/lib/chain";
export type ProofType =
  | "started"
  | "submitted"
  | "used"
  | "reserved"
  | "returned"
  | "rejected"
  | "new block"
  | "block proof"
  | "unknown";
export interface Proof {
  id: string;
  type: ProofType;
  txHash: string;
  proofCount?: number;
  sequences?: number[];
  startSequence?: number;
  endSequence?: number;
  blockNumber: number;
  storageHash?: string;
  time: number;
}

export function LastProofs({ proofs }: { proofs: Proof[] }) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full p-1 flex flex-col">
      <h3 className="text-sm font-semibold mb-0.5 text-[#8358FF]">
        Last Proofs
      </h3>

      <div className="grid grid-cols-7 text-[10px] text-[#848e9c] mb-0.5 font-medium">
        <div>Type</div>
        <div>Tx Hash</div>
        <div className="text-center">Block</div>
        <div>DA Hash</div>
        <div className="text-center">Tx Count</div>
        <div className="text-center">Txs</div>
        <div className="text-right">Time</div>
      </div>

      <div className="overflow-hidden max-h-[calc(100%-18px)] flex-1">
        {proofs.map((proof) => (
          <div
            key={proof.id}
            className="grid grid-cols-7 text-[10px] hover:bg-[#2a2e37] transition-colors"
          >
            <div
              className={`truncate ${
                proof.type === "started"
                  ? "text-[#1E80FF]"
                  : proof.type === "submitted"
                  ? "text-[#02c076]"
                  : proof.type === "used"
                  ? "text-[#8358FF]"
                  : proof.type === "reserved"
                  ? "text-[#f6a609]"
                  : proof.type === "returned"
                  ? "text-[#848e9c]"
                  : proof.type === "rejected"
                  ? "text-[#f6465d]"
                  : proof.type === "new block"
                  ? "text-[#00b8d9]"
                  : proof.type === "block proof"
                  ? "text-[#36b37e]"
                  : "text-[#848e9c]"
              }`}
            >
              {proof.type}
            </div>
            <div className="truncate text-[#8358FF]">
              <a
                href={suiExplorerTxUrl(proof.txHash ?? "")}
                className="text-accent hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortenString(proof.txHash, 10)}
              </a>
            </div>
            <div className="text-center ">{proof.blockNumber}</div>
            <div className="truncate text-[#848e9c]">
              <a
                href={daUrl(proof.storageHash ?? "")}
                className="text-accent hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortenString(proof.storageHash, 10)}
              </a>
            </div>
            <div className="text-center text-[#8358FF]">
              {proof.proofCount ?? ""}
            </div>
            <div className="text-center text-[#848e9c]">
              {proof.startSequence && proof.endSequence
                ? proof.startSequence === proof.endSequence
                  ? proof.startSequence
                  : `${proof.startSequence} - ${proof.endSequence}`
                : ""}
            </div>
            <div className="text-right text-[#848e9c]">
              {formatTime(proof.time, currentTime)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
