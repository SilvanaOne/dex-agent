"use client";

import { useState, useEffect } from "react";
import { shortenString } from "@/lib/short";
import type {
  LastTransactionData,
  LastTransactionErrors,
  TransactionProof,
  TransactionError,
  MinaTransactionEvent,
} from "@dex-agent/lib";
import { suiExplorerTxUrl, daUrl, explorerTransactionUrl } from "@/lib/chain";
import { Proof } from "./last-proofs";
import { formatTime } from "@/lib/format";
interface LastTransactionProps {
  txData: LastTransactionData | LastTransactionErrors | null;
  proofs: Proof[];
  tx?: MinaTransactionEvent;
}

export default function LastTransaction({
  txData,
  proofs,
  tx,
}: LastTransactionProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  if (txData === null) {
    return (
      <div className="h-full p-1 flex items-center justify-center text-[10px] text-[#848e9c]">
        No last transaction data
      </div>
    );
  }
  const isLastTransactionData = (txData as any).digest !== undefined;
  const data = txData as LastTransactionData;

  return (
    <div className="h-full p-1 overflow-hidden flex flex-col">
      <h3 className="text-sm font-semibold mb-0.5 text-[#f0b90b]">
        Your Last Transaction
      </h3>

      {isLastTransactionData && (
        <>
          <div className="grid grid-cols-2 gap-x-1 text-[10px] mb-1">
            <div className="text-[#848e9c]">ZK coordination tx hash:</div>
            <div className="truncate text-[#f0b90b]">
              <a
                href={suiExplorerTxUrl(data.digest?.toString() ?? "")}
                className="text-accent hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {shortenString(data.digest.toString(), 10)}
              </a>
            </div>

            <div className="text-[#848e9c]">Tx prepared in:</div>
            <div className="text-white">{data.prepareTime} ms</div>

            <div className="text-[#848e9c]">Tx executed in:</div>
            <div className="text-white">{data.executeTime} ms</div>

            {data.indexTime && (
              <>
                <div className="text-[#848e9c]">Tx indexed in:</div>
                <div className="text-white">{data.indexTime} ms</div>
              </>
            )}

            <div className="text-[#848e9c]">ZK block number:</div>
            <div className="text-white">{data.blockNumber}</div>

            <div className="text-[#848e9c]">ZK sequence number:</div>
            <div className="text-white">{data.sequence}</div>

            {data.minaTxHash && (
              <>
                <div className="text-[#848e9c]">Mina tx hash:</div>
                <div className="truncate text-[#f0b90b]">
                  {shortenString(data.minaTxHash, 10)}
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Transaction Errors Section */}
      {txData.errors && (
        <div className="mb-1">
          <div className="text-[10px] font-semibold mb-0.5 text-[#f6465d]">
            Transaction Errors
          </div>
          <div className="max-h-[40px] overflow-auto">
            {txData.errors.map((error, index) => (
              <div key={index} className="text-[10px] mb-0.5 flex items-start">
                <span
                  className={`mr-1 ${
                    error.severity === "error"
                      ? "text-[#f6465d]"
                      : "text-[#f7931a]"
                  }`}
                >
                  [{error.code}]
                </span>
                <span className="text-white">{error.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tx && (
        <>
          <div className="text-[10px] font-semibold mb-0.5 text-white">
            Settlement Transaction
          </div>

          <div className="grid grid-cols-7 text-[9px] text-[#848e9c] mb-0.5 font-medium">
            <div>Tx Hash</div>
            <div className="text-center">Block</div>
            <div className="text-center">State DA</div>
            <div className="text-center">Proof DA</div>
            <div className="text-right">Tx Count</div>
            <div className="text-center">Txs</div>
            <div className="text-right">Time</div>
          </div>

          <div className="overflow-hidden max-h-[calc(100%-18px)] flex-1">
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
              <div className="truncate text-[#848e9c]">
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
              <div className="text-right">
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
          </div>
        </>
      )}

      {proofs && proofs.length > 0 && (
        <>
          <div className="text-[10px] font-semibold mb-0.5 text-white">
            Transaction Proofs
          </div>

          <div className="grid grid-cols-6 text-[10px] text-[#848e9c] mb-0.5 font-medium">
            <div>Type</div>
            <div>Tx Hash</div>
            <div>Txs</div>
            <div>DA Hash</div>
            <div className="text-center">Txs</div>
            <div className="text-right">Time</div>
          </div>

          <div className="overflow-hidden max-h-[calc(100%-130px)] flex-1">
            {proofs.map((proof) => (
              <div
                key={proof.id}
                className="grid grid-cols-6 text-[10px] hover:bg-[#2a2e37] transition-colors"
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
                <div className="text-[#f0b90b] ml-3">{proof.proofCount}</div>
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
        </>
      )}
    </div>
  );
}
