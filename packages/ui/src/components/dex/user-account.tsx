"use client";

import type {
  PendingTransactions,
  TransactionType,
  OrderFormState,
  UserTradingAccount,
} from "@dex-agent/lib";
import { useState } from "react";
import Processing from "./ui/processing";
import { daUrl } from "@/lib/chain";
import { shortenString } from "@/lib/short";
interface UserAccountProps {
  account: UserTradingAccount | undefined;
  pendingTransactions: PendingTransactions | undefined;
  highlight: boolean;
  faucet: () => void;
  createAccount: () => void;
  proveAccount: () => void;
  processing: TransactionType | undefined;
  proof?: string;
  jobId?: string;
}

export default function UserAccount({
  account,
  pendingTransactions,
  highlight,
  faucet,
  createAccount,
  proveAccount,
  processing,
  proof,
  jobId,
}: UserAccountProps) {
  const [activeTab, setActiveTab] = useState<
    "balances" | "deposits" | "withdrawals"
  >("balances");

  const formatBalance = (num: bigint | undefined): string => {
    if (num === undefined) return "-";
    const fixed = (Number(BigInt(num) / 1_000n) / 1_000_000).toLocaleString(
      undefined,
      {
        maximumSignificantDigits: 4,
      }
    );
    return fixed;
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor(
      (seconds % 3600) / 60
    )}m`;
  };

  if (!account) {
    return (
      <div className="text-center p-4">
        <button
          onClick={createAccount}
          disabled={processing !== undefined}
          className="bg-[#1E80FF] hover:bg-[#1a70e0] rounded-lg px-10 py-2 text-xs transition-colors flex items-center justify-center mx-auto animate-pulse shadow-lg shadow-[#1E80FF]/30"
        >
          {processing === "createAccount" ? (
            <>
              <Processing />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`h-full flex flex-col rounded-lg border ${
        highlight
          ? "border-accent shadow-[0_0_10px_rgba(131,88,255,0.3)]"
          : "border-[#2a2e37]"
      } p-0.5 text-[9px]`}
    >
      {/* Tabs for switching between sections */}
      <div className="flex mb-1 border border-[#2a2e37] rounded-lg overflow-hidden text-[10px]">
        <button
          className={`flex-1 py-0.5 text-center ${
            activeTab === "balances"
              ? "bg-[#1E80FF] text-white"
              : "bg-[#2a2e37] text-[#848e9c] hover:bg-[#3a3e47]"
          } transition-colors`}
          onClick={() => setActiveTab("balances")}
        >
          Balances
        </button>
        <button
          className={`flex-1 py-0.5 text-center ${
            activeTab === "deposits"
              ? "bg-[#f0b90b] text-white"
              : "bg-[#2a2e37] text-[#848e9c] hover:bg-[#3a3e47]"
          } transition-colors`}
          onClick={() => setActiveTab("deposits")}
        >
          Deposits
        </button>
        <button
          className={`flex-1 py-0.5 text-center ${
            activeTab === "withdrawals"
              ? "bg-[#f6465d] text-white"
              : "bg-[#2a2e37] text-[#848e9c] hover:bg-[#3a3e47]"
          } transition-colors`}
          onClick={() => setActiveTab("withdrawals")}
        >
          Withdrawals
        </button>
      </div>

      {/* Balances Tab */}
      {activeTab === "balances" && (
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="text-center font-bold mb-0.5 text-[12px] text-white">
            WALLET BALANCE
          </div>

          {/* Assets Section - Professional styling */}
          <div className="mb-0.5 overflow-auto">
            <div className="grid grid-cols-[minmax(50px,auto)_1fr_1fr_1fr] gap-x-1 mb-0.5">
              <div className="text-[8px] text-[#848e9c]"></div>
              <div className="text-[11px] text-[#848e9c] text-right pr-1">
                Available
              </div>
              <div className="text-[11px] text-[#848e9c] text-right pr-1">
                Staked
              </div>
              <div className="text-[11px] text-[#848e9c] text-right pr-1">
                Borrowed
              </div>
            </div>

            {/* WETH Row */}
            <div className="grid grid-cols-[minmax(50px,auto)_1fr_1fr_1fr] gap-x-1 mb-0.5 items-center">
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1E80FF] mr-0.5"></div>
                <span className="font-medium text-[11px] text-white">WETH</span>
              </div>
              <div className="text-right text-[11px] font-medium pr-1">
                {formatBalance(account.baseTokenBalance.amount)}
              </div>
              <div className="text-right text-[11px] font-medium pr-1">
                {formatBalance(account.baseTokenBalance.stakedAmount)}
              </div>
              <div className="text-right text-[11px] font-medium pr-1">
                {formatBalance(account.baseTokenBalance.borrowedAmount)}
              </div>
            </div>

            {/* WUSD Row */}
            <div className="grid grid-cols-[minmax(50px,auto)_1fr_1fr_1fr] gap-x-1 items-center">
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#02c076] mr-0.5"></div>
                <span className="font-medium text-[11px] text-white">WUSD</span>
              </div>
              <div className="text-right text-[11px] font-medium pr-1">
                {formatBalance(account.quoteTokenBalance.amount)}
              </div>
              <div className="text-right text-[11px] font-medium pr-1">
                {formatBalance(account.quoteTokenBalance.stakedAmount)}
              </div>
              <div className="text-right text-[11px] font-medium pr-1">
                {formatBalance(account.quoteTokenBalance.borrowedAmount)}
              </div>
            </div>
          </div>

          {/* Account Info Section - Professional styling */}
          <div className="mb-0.5">
            <div className="text-[11px] font-semibold border-b border-[#2a2e37] pb-0.5 mb-0.5 text-white">
              ACCOUNT INFO
            </div>
            <div className="flex justify-between text-[9px]">
              <span className="text-[#848e9c]">Account Nonce:</span>
              <span className="font-medium">{account.nonce.toString()}</span>
            </div>
            <div className="flex justify-between text-[9px]">
              <span className="text-[#848e9c]">Prove account Job ID:</span>
              {jobId ? (
                <a
                  href={`https://silvascan.io/testnet/agent-job/${jobId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#1E80FF] hover:underline"
                >
                  {shortenString(jobId ?? "", 10)}
                </a>
              ) : (
                <span className="font-medium">-</span>
              )}
            </div>
            <div className="flex justify-between text-[9px]">
              <span className="text-[#848e9c]">Proof:</span>
              {proof ? (
                <a
                  href={daUrl(proof ?? "")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#1E80FF] hover:underline"
                >
                  {shortenString(proof ?? "", 10)}
                </a>
              ) : (
                <span className="font-medium">-</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deposits Tab */}
      {activeTab === "deposits" && (
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="text-center font-bold mb-0.5 text-[12px] text-[#f0b90b]">
            PENDING DEPOSITS
          </div>

          {pendingTransactions?.pendingDeposits.length === 0 ? (
            <div className="text-center text-[10px] text-[#848e9c] mt-2">
              No pending deposits
            </div>
          ) : (
            <div className="space-y-2">
              {pendingTransactions?.pendingDeposits.map((deposit) => (
                <div
                  key={deposit.id}
                  className="border border-[#2a2e37] rounded p-1"
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[9px] font-medium text-white">
                      Transaction ID:
                    </span>
                    <span className="text-[9px] text-[#f0b90b]">
                      {deposit.id.substring(0, 8)}...
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[9px] mb-0.5">
                    <div>
                      <span className="text-[#848e9c]">Amount:</span>{" "}
                      <span className="text-[#f0b90b]">
                        {formatBalance(deposit.amount)} {deposit.currency}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#848e9c]">Confirmations:</span>{" "}
                      <span className="text-white">
                        {deposit.confirmations}/12
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-[#848e9c]">
                      Estimated time remaining:
                    </span>
                    <span className="text-[9px] text-white">
                      {formatTime(deposit.estimatedTimeRemaining)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Withdrawals Tab */}
      {activeTab === "withdrawals" && (
        <div className="flex-1 flex flex-col overflow-auto">
          <div className="text-center font-bold mb-0.5 text-[12px] text-[#f6465d]">
            PENDING WITHDRAWALS
          </div>

          {pendingTransactions?.pendingWithdrawals.length === 0 ? (
            <div className="text-center text-[10px] text-[#848e9c] mt-2">
              No pending withdrawals
            </div>
          ) : (
            <div className="space-y-2">
              {pendingTransactions?.pendingWithdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className="border border-[#2a2e37] rounded p-1"
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[9px] font-medium text-white">
                      Transaction ID:
                    </span>
                    <span className="text-[9px] text-[#f6465d]">
                      {withdrawal.id.substring(0, 8)}...
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-[9px] mb-0.5">
                    <div>
                      <span className="text-[#848e9c]">Amount:</span>{" "}
                      <span className="text-[#f6465d]">
                        {formatBalance(withdrawal.amount)} {withdrawal.currency}
                      </span>
                    </div>
                    <div>
                      <span className="text-[#848e9c]">Confirmations:</span>{" "}
                      <span className="text-white">
                        {withdrawal.confirmations}/12
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-[#848e9c]">
                      Estimated time remaining:
                    </span>
                    <span className="text-[9px] text-white">
                      {formatTime(withdrawal.estimatedTimeRemaining)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Faucet button with blue color */}
      <button
        onClick={() => {
          if (
            account &&
            account.baseTokenBalance.amount > 0n &&
            account.quoteTokenBalance.amount > 0n
          ) {
            proveAccount();
          } else {
            faucet();
          }
        }}
        disabled={processing !== undefined}
        className="h-9 w-full bg-[#1E80FF] hover:bg-[#1a70e0] rounded-lg text-[12px] font-semibold transition-colors flex items-center justify-center"
      >
        {processing === "faucet" ? (
          <>
            <Processing />
            Getting funds from faucet...
          </>
        ) : processing === "proveAccount" ? (
          <>
            <Processing />
            Proving account...
          </>
        ) : account &&
          account.baseTokenBalance.amount > 0n &&
          account.quoteTokenBalance.amount > 0n ? (
          "Prove Account"
        ) : (
          "Faucet"
        )}
      </button>
    </div>
  );
}
