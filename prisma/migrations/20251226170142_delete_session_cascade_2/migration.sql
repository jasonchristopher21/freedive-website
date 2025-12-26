-- DropForeignKey
ALTER TABLE "SessionIC" DROP CONSTRAINT "SessionIC_sessionId_fkey";

-- AddForeignKey
ALTER TABLE "SessionIC" ADD CONSTRAINT "SessionIC_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
