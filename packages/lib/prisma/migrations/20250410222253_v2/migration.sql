/*
  Warnings:

  - You are about to drop the column `senderSignature` on the `ActionRequest` table. All the data in the column will be lost.
  - You are about to drop the column `userSignature` on the `ActionRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ActionRequest" DROP COLUMN "senderSignature",
DROP COLUMN "userSignature",
ADD COLUMN     "senderSignatureR" BIGINT,
ADD COLUMN     "senderSignatureS" BIGINT,
ADD COLUMN     "userSignatureR" BIGINT,
ADD COLUMN     "userSignatureS" BIGINT;
