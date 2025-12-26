-- DropForeignKey
ALTER TABLE "Signup" DROP CONSTRAINT "Signup_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "TrainingPlan" DROP CONSTRAINT "TrainingPlan_sessionId_fkey";

-- AddForeignKey
ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signup" ADD CONSTRAINT "Signup_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
