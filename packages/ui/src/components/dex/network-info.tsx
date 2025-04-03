"use client";

import { useState, useEffect } from "react";
import { shortenString } from "@/lib/short";
import { NetworkInfoData } from "@dex-agent/lib";
import { daUrl, explorerAccountUrl, suiExplorerObjectUrl } from "@/lib/chain";
interface NetworkInfoProps {
  networkInfo?: NetworkInfoData;
}

export default function NetworkInfo({ networkInfo }: NetworkInfoProps) {
  if (!networkInfo) {
    return (
      <div className="h-full p-1 flex items-center justify-center text-[10px] text-[#848e9c]">
        Getting Network Info...
      </div>
    );
  }
  return (
    <div className="h-full p-1 flex flex-col">
      <h3 className="text-sm font-semibold mb-0.5 text-white">Network Info</h3>
      <div className="text-[10px]">
        <div className="flex justify-between mb-0.5">
          <span className="text-[#848e9c]">Settlement chain:</span>
          <span className="text-white">{networkInfo?.l1Settlement ?? "-"}</span>
        </div>
        <div className="flex justify-between mb-0.5">
          <span className="text-[#848e9c]">Mina network:</span>
          <span className="text-white">{networkInfo?.minaChainId ?? "-"}</span>
        </div>
        <div className="flex justify-between mb-0.5">
          <span className="text-[#848e9c]">Mina Contract:</span>
          <span className="text-white">
            <a
              href={
                explorerAccountUrl() + (networkInfo?.minaContractAddress ?? "")
              }
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortenString(networkInfo?.minaContractAddress ?? "", 16)}
            </a>
          </span>
        </div>
        <div className="flex justify-between mb-0.5">
          <span className="text-[#848e9c]">Mina Rollup Circuit:</span>
          <span className="text-white">
            {networkInfo?.circuitDescription ?? "-"}
          </span>
        </div>
        <div className="flex justify-between mb-0.5">
          <span className="text-[#848e9c]">ZK Coordination:</span>
          <span className="text-white">
            {networkInfo?.zkCoordination ?? "-"}
          </span>
        </div>
        <div className="flex justify-between mb-0.5">
          <span className="text-[#848e9c]">ZK Coordination Address:</span>
          <span className="text-white">
            <a
              href={suiExplorerObjectUrl(networkInfo?.suiAddress ?? "")}
              className="text-accent hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortenString(networkInfo?.suiAddress ?? "", 16)}
            </a>
          </span>
        </div>
        <div className="flex justify-between mb-0.5">
          <span className="text-[#848e9c]">Data Availability:</span>
          <span className="text-white">
            {networkInfo?.dataAvailability ?? "-"}
          </span>
        </div>
        <div className="flex justify-between mb-0.5">
          <span className="text-[#848e9c]">Wallet:</span>
          <span className="text-white">{networkInfo?.wallet ?? "-"}</span>
        </div>

        {/* Added last block number */}
        <div className="flex justify-between mb-0.5">
          <span className="text-[#848e9c]">Last Block:</span>
          <span className="text-[#02c076]">
            #{networkInfo?.lastBlockNumber?.toLocaleString() ?? "-"}
          </span>
        </div>

        {/* Added last proved block number */}
        <div className="flex justify-between mb-0.5">
          <span className="text-[#848e9c]">Last Proved Block:</span>
          <span className="text-[#f0b90b]">
            #{networkInfo?.lastProvedBlockNumber?.toLocaleString() ?? "-"}
          </span>
        </div>

        {/* Added sequence */}
        <div className="flex justify-between mb-0.5">
          <span className="text-[#848e9c]">Sequence:</span>
          <span className="text-[#1E80FF]">
            {networkInfo?.sequence?.toLocaleString() ?? "-"}
          </span>
        </div>

        {/* Added circuit DA hash */}
        <div className="flex justify-between mb-0.5">
          <span className="text-[#848e9c]">Circuit DA Hash:</span>
          <span className="text-white">
            <a
              href={daUrl(networkInfo?.minaCircuitDAHash ?? "")}
              className="text-[#8358FF] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {shortenString(networkInfo?.minaCircuitDAHash ?? "", 16)}
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
