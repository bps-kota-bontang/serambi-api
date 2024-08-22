-- DropForeignKey
ALTER TABLE "credentials" DROP CONSTRAINT "credentials_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "service_team" DROP CONSTRAINT "service_team_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "service_team" DROP CONSTRAINT "service_team_teamId_fkey";

-- DropForeignKey
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_teamId_fkey";

-- DropForeignKey
ALTER TABLE "user_team" DROP CONSTRAINT "user_team_userId_fkey";

-- AddForeignKey
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_team" ADD CONSTRAINT "user_team_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_team" ADD CONSTRAINT "service_team_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_team" ADD CONSTRAINT "service_team_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
