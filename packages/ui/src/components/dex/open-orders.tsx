"use client";

import type { UserTradingAccount } from "@dex-agent/lib";
import { OrderFormState, TransactionType } from "@dex-agent/lib";
import Processing from "@/components/dex/ui/processing";

interface OpenOrdersProps {
  account: UserTradingAccount | undefined;
  address: string | undefined;
  executeOrder: (order: OrderFormState) => void;
  processing: TransactionType | undefined;
}

export default function OpenOrders({
  account,
  address,
  executeOrder,
  processing,
}: OpenOrdersProps) {
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

  const handleCancelOrder = (type: "bid" | "ask") => {
    console.log(`Cancelling ${type} order`);
    executeOrder({
      orderType: type === "bid" ? "cancelBuy" : "cancelSell",
      amount: "0",
      price: "0",
      recipient: "",
      collateral: "",
      transferCurrency: "WETH",
      stakeCurrency: undefined,
      borrowCurrency: undefined,
    });
  };

  if (!address) {
    return (
      <div className="h-full flex items-center justify-center text-[10px] text-[#848e9c]">
        Connect wallet to view orders
      </div>
    );
  }

  if (!account) {
    return (
      <div className="h-full flex items-center justify-center text-[10px] text-[#848e9c]">
        Create an account in the DEX
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col rounded-lg border border-[#2a2e37] p-0.5 text-[9px]">
      <div className="text-center font-bold mb-0.5 text-[12px] text-white">
        OPEN ORDERS
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* BID Section */}
        <div className="flex-1 pr-1 border-r border-[#2a2e37]">
          <div className="text-[11px] font-semibold border-b border-[#2a2e37] pb-0.5 mb-0.5 text-[#02c076]">
            BUY ORDER
          </div>
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[9px] font-medium text-white">Status:</span>
            <span className="text-[9px] text-[#848e9c]">
              {account.bid.isSome ? "Active" : "No active order"}
            </span>
          </div>
          {account.bid.isSome && (
            <>
              <div className="grid grid-cols-2 gap-1 text-[9px] mb-1">
                <div>
                  <span className="text-[#848e9c]">Amount:</span>{" "}
                  <span className="text-[#02c076]">
                    {formatBalance(account.bid.amount)} WETH
                  </span>
                </div>
                <div>
                  <span className="text-[#848e9c]">Price:</span>{" "}
                  <span className="text-[#02c076]">
                    {formatBalance(account.bid.price)} WUSD
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleCancelOrder("bid")}
                disabled={processing !== undefined}
                className="w-full bg-[#2a2e37] text-[#848e9c] hover:bg-[#1a70e0] hover:text-white rounded py-0.5 text-[9px] transition-colors flex items-center justify-center"
              >
                {processing === "cancelBuy" ? (
                  <>
                    <Processing />
                    Cancelling...
                  </>
                ) : (
                  "Cancel"
                )}
              </button>
            </>
          )}
        </div>

        {/* ASK Section */}
        <div className="flex-1 pl-1">
          <div className="text-[11px] font-semibold border-b border-[#2a2e37] pb-0.5 mb-0.5 text-[#f6465d]">
            SELL ORDER
          </div>
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[9px] font-medium text-white">Status:</span>
            <span className="text-[9px] text-[#848e9c]">
              {account.ask.isSome ? "Active" : "No active order"}
            </span>
          </div>
          {account.ask.isSome && (
            <>
              <div className="grid grid-cols-2 gap-1 text-[9px] mb-1">
                <div>
                  <span className="text-[#848e9c]">Amount:</span>{" "}
                  <span className="text-[#f6465d]">
                    {formatBalance(account.ask.amount)} WETH
                  </span>
                </div>
                <div>
                  <span className="text-[#848e9c]">Price:</span>{" "}
                  <span className="text-[#f6465d]">
                    {formatBalance(account.ask.price)} WUSD
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleCancelOrder("ask")}
                disabled={processing !== undefined}
                className="w-full bg-[#2a2e37] text-[#848e9c] hover:bg-[#1a70e0] hover:text-white rounded py-0.5 text-[9px] transition-colors flex items-center justify-center"
              >
                {processing === "cancelSell" ? (
                  <>
                    <Processing />
                    Cancelling...
                  </>
                ) : (
                  "Cancel"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
