-- AlterEnum
ALTER TYPE "Operation" ADD VALUE 'PROOF';

-- AlterTable
ALTER TABLE "ActionRequest" ADD COLUMN     "sequence" BIGINT;
