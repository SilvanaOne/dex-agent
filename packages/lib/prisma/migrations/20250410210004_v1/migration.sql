-- CreateEnum
CREATE TYPE "Operation" AS ENUM ('CREATE_ACCOUNT', 'BID', 'ASK', 'TRADE', 'TRANSFER');

-- CreateEnum
CREATE TYPE "ActionStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "State" (
    "sequence" BIGINT NOT NULL,
    "address" TEXT NOT NULL,
    "baseTokenAmount" BIGINT NOT NULL,
    "baseTokenStakedAmount" BIGINT NOT NULL,
    "baseTokenBorrowedAmount" BIGINT NOT NULL,
    "quoteTokenAmount" BIGINT NOT NULL,
    "quoteTokenStakedAmount" BIGINT NOT NULL,
    "quoteTokenBorrowedAmount" BIGINT NOT NULL,
    "bidAmount" BIGINT NOT NULL,
    "bidPrice" BIGINT NOT NULL,
    "bidIsSome" BOOLEAN NOT NULL,
    "askAmount" BIGINT NOT NULL,
    "askPrice" BIGINT NOT NULL,
    "askIsSome" BOOLEAN NOT NULL,
    "nonce" BIGINT NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("sequence","address")
);

-- CreateTable
CREATE TABLE "FetchedSequences" (
    "sequence" BIGINT NOT NULL,

    CONSTRAINT "FetchedSequences_pkey" PRIMARY KEY ("sequence")
);

-- CreateTable
CREATE TABLE "ActionRequest" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operation" "Operation" NOT NULL,
    "status" "ActionStatus" NOT NULL DEFAULT 'PENDING',
    "address" TEXT,
    "poolPublicKey" TEXT,
    "publicKey" TEXT,
    "publicKeyBase58" TEXT,
    "name" TEXT,
    "role" TEXT,
    "image" TEXT,
    "baseBalance" BIGINT,
    "quoteBalance" BIGINT,
    "userPublicKey" TEXT,
    "baseTokenAmount" BIGINT,
    "price" BIGINT,
    "isSome" BOOLEAN,
    "nonce" BIGINT,
    "userSignature" TEXT,
    "buyerPublicKey" TEXT,
    "sellerPublicKey" TEXT,
    "quoteTokenAmount" BIGINT,
    "buyerNonce" BIGINT,
    "sellerNonce" BIGINT,
    "senderPublicKey" TEXT,
    "receiverPublicKey" TEXT,
    "senderNonce" BIGINT,
    "receiverNonce" BIGINT,
    "senderSignature" TEXT,

    CONSTRAINT "ActionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "State_sequence_idx" ON "State"("sequence");

-- CreateIndex
CREATE INDEX "State_address_idx" ON "State"("address");

-- CreateIndex
CREATE INDEX "ActionRequest_operation_idx" ON "ActionRequest"("operation");

-- CreateIndex
CREATE INDEX "ActionRequest_status_idx" ON "ActionRequest"("status");
