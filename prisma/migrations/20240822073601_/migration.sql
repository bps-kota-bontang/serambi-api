/*
  Warnings:

  - You are about to drop the `Credential` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Credential" DROP CONSTRAINT "Credential_serviceId_fkey";

-- DropTable
DROP TABLE "Credential";

-- CreateTable
CREATE TABLE "credentials" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "isSso" BOOLEAN NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credentials_serviceId_key" ON "credentials"("serviceId");

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
