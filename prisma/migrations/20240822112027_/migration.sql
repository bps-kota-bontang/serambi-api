/*
  Warnings:

  - You are about to drop the column `isSso` on the `credentials` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "credentials" DROP COLUMN "isSso",
ADD COLUMN     "hasSso" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "note" TEXT;
