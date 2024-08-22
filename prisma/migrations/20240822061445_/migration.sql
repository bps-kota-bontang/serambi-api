-- CreateTable
CREATE TABLE "Credential" (
    "id" TEXT NOT NULL,
    "username" TEXT,
    "password" TEXT,
    "isSso" BOOLEAN NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Credential_serviceId_key" ON "Credential"("serviceId");

-- AddForeignKey
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
