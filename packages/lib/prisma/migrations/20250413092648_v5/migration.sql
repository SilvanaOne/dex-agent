-- AlterEnum
ALTER TYPE "ActionStatus" ADD VALUE 'PROCESSING';

-- AlterTable
ALTER TABLE "ActionRequest" ADD COLUMN     "agent" TEXT;
