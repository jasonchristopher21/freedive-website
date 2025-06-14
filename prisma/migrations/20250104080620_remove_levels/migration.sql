/*
  Warnings:

  - The values [beginner,intermediate,advanced] on the enum `Level` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `icId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `trainingPlanId` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `User` table. All the data in the column will be lost.
  - Added the required column `description` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nusnetEmail` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearOfEntry` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yearOfStudy` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccessRole" AS ENUM ('MEMBER', 'IC', 'ADMIN');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('TRAINING', 'EVENT', 'SAFETY_REFRESHER');

-- CreateEnum
CREATE TYPE "YearOfStudy" AS ENUM ('YEAR_1', 'YEAR_2', 'YEAR_3', 'YEAR_4', 'ALUMNI', 'GRADUATE');

-- AlterEnum
BEGIN;
CREATE TYPE "Level_new" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
ALTER TABLE "User" ALTER COLUMN "level" TYPE "Level_new" USING ("level"::text::"Level_new");
ALTER TYPE "Level" RENAME TO "Level_old";
ALTER TYPE "Level_new" RENAME TO "Level";
DROP TYPE "Level_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_icId_fkey";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "icId",
DROP COLUMN "time",
DROP COLUMN "trainingPlanId",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "endTime" TIME(6) NOT NULL,
ADD COLUMN     "lanes" INTEGER[],
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "sessionType" "SessionType" NOT NULL DEFAULT 'TRAINING',
ADD COLUMN     "startTime" TIME(6) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isAdmin",
ADD COLUMN     "accessRole" "AccessRole" NOT NULL DEFAULT 'MEMBER',
ADD COLUMN     "nusnetEmail" TEXT NOT NULL,
ADD COLUMN     "preferredName" TEXT,
ADD COLUMN     "remarks" TEXT,
ADD COLUMN     "roleId" UUID NOT NULL,
ADD COLUMN     "yearOfEntry" INTEGER NOT NULL,
ADD COLUMN     "yearOfStudy" "YearOfStudy" NOT NULL;

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingPlan" (
    "id" UUID NOT NULL,
    "generalPlan" TEXT,
    "beginnerPlan" TEXT,
    "intermediatePlan" TEXT,
    "advancedPlan" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" UUID,

    CONSTRAINT "TrainingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionIC" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionIC_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingPlan_sessionId_key" ON "TrainingPlan"("sessionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionIC" ADD CONSTRAINT "SessionIC_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionIC" ADD CONSTRAINT "SessionIC_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
