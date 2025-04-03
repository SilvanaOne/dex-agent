import type {
  PendingTransactions,
  LastTransactionData,
  TransactionProof,
  TransactionError,
} from "@dex-agent/lib";

// Simulate fetching account data
export const mockTransactions: PendingTransactions = {
  pendingDeposits: [
    {
      id: "5Ju8crbVdApmLqWFddgkfQyqLe2DRC3oACVXzfGSvvrJF1Q6bWfa",
      amount: 2500000000n,
      currency: "WETH",
      timestamp: Date.now() - 300000, // 5 minutes ago
      confirmations: 4,
      estimatedTimeRemaining: 480, // 8 minutes
    },
    {
      id: "5JukH18KXPA6iNdxRc6sy5YRAxwiEK1WZWB9gQVZ8TiowMWtXSHZ",
      amount: 5000000000000n,
      currency: "WUSD",
      timestamp: Date.now() - 600000, // 10 minutes ago
      confirmations: 8,
      estimatedTimeRemaining: 240, // 4 minutes
    },
  ],
  pendingWithdrawals: [
    {
      id: "5JtqZvydJ3pADvv81yFemtfveq3FeNte8ZPxhw7C2ndo2LKbFtr9",
      amount: 1000000000n,
      currency: "WETH",
      timestamp: Date.now() - 900000, // 15 minutes ago
      confirmations: 10,
      estimatedTimeRemaining: 120, // 2 minutes
    },
    {
      id: "5JuxV8csvXD9GvkZZ5deE8uixoPpkKvbGH51356n3y62gwNbMuiZ",
      amount: 2000000000000n,
      currency: "WUSD",
      timestamp: Date.now() - 1200000, // 20 minutes ago
      confirmations: 11,
      estimatedTimeRemaining: 60, // 1 minute
    },
  ],
};

const mockProofs: TransactionProof[] = [];

for (let i = 0; i < 3; i++) {
  const proofCount = Math.floor(Math.random() * 5) + 1;
  const storageHash = "jbljSYMtd6lwdhlLjUN0gOf6mIz9MzLX1_d5XrJ9NxE";
  const secondsAgo = Math.floor(Math.random() * 60);

  mockProofs.push({
    id: i,
    proofCount,
    storageHash,
    time: `${secondsAgo}s ago`,
  });
}

// Generate mock errors (randomly decide if there are errors)
const hasErrors = Math.random() > 0.5;
const mockErrors: TransactionError[] = [];

if (hasErrors) {
  mockErrors.push({
    code: "E1001",
    message: "Insufficient balance for gas fees",
    severity: "error",
  });

  if (Math.random() > 0.5) {
    mockErrors.push({
      code: "W2003",
      message: "High network congestion, increased latency",
      severity: "warning",
    });
  }
}
