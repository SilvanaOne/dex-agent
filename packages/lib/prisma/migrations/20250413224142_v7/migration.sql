/*
  Warnings:

  - You are about to alter the column `baseBalance` on the `ActionRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `quoteBalance` on the `ActionRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `baseTokenAmount` on the `ActionRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `price` on the `ActionRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `nonce` on the `ActionRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `quoteTokenAmount` on the `ActionRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `buyerNonce` on the `ActionRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `sellerNonce` on the `ActionRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `senderNonce` on the `ActionRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `receiverNonce` on the `ActionRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `senderSignatureR` on the `ActionRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `senderSignatureS` on the `ActionRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `userSignatureR` on the `ActionRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `userSignatureS` on the `ActionRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `sequence` on the `ActionRequest` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `baseTokenAmount` on the `State` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `baseTokenStakedAmount` on the `State` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `baseTokenBorrowedAmount` on the `State` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `quoteTokenAmount` on the `State` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `quoteTokenStakedAmount` on the `State` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `quoteTokenBorrowedAmount` on the `State` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `bidAmount` on the `State` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `bidPrice` on the `State` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `askAmount` on the `State` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `askPrice` on the `State` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.
  - You are about to alter the column `nonce` on the `State` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(80,0)`.

*/
-- AlterTable
ALTER TABLE "ActionRequest" ALTER COLUMN "baseBalance" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "quoteBalance" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "baseTokenAmount" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "price" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "nonce" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "quoteTokenAmount" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "buyerNonce" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "sellerNonce" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "senderNonce" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "receiverNonce" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "senderSignatureR" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "senderSignatureS" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "userSignatureR" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "userSignatureS" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "sequence" SET DATA TYPE DECIMAL(80,0);

-- AlterTable
ALTER TABLE "State" ALTER COLUMN "baseTokenAmount" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "baseTokenStakedAmount" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "baseTokenBorrowedAmount" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "quoteTokenAmount" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "quoteTokenStakedAmount" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "quoteTokenBorrowedAmount" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "bidAmount" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "bidPrice" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "askAmount" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "askPrice" SET DATA TYPE DECIMAL(80,0),
ALTER COLUMN "nonce" SET DATA TYPE DECIMAL(80,0);
