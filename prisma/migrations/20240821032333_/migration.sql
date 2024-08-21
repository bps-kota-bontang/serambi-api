/*
  Warnings:

  - You are about to drop the column `logoUrl` on the `services` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "services" DROP COLUMN "logoUrl",
ADD COLUMN     "imageUrl" TEXT;
