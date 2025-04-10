/*
  Warnings:

  - You are about to drop the column `age` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'video_view_tiktok';
ALTER TYPE "EventType" ADD VALUE 'like';
ALTER TYPE "EventType" ADD VALUE 'share';
ALTER TYPE "EventType" ADD VALUE 'profile_visit';
ALTER TYPE "EventType" ADD VALUE 'purchase';
ALTER TYPE "EventType" ADD VALUE 'follow';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "age",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "gender",
DROP COLUMN "name";

-- CreateTable
CREATE TABLE "FacebookProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "FacebookProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TiktokProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,

    CONSTRAINT "TiktokProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FacebookProfile_userId_key" ON "FacebookProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TiktokProfile_userId_key" ON "TiktokProfile"("userId");

-- AddForeignKey
ALTER TABLE "FacebookProfile" ADD CONSTRAINT "FacebookProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiktokProfile" ADD CONSTRAINT "TiktokProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
