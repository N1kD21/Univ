-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'non_binary');

-- CreateEnum
CREATE TYPE "FunnelStage" AS ENUM ('top', 'bottom');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('ad_view', 'page_like', 'comment', 'video_view', 'ad_click', 'form_submission', 'checkout_complete');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('facebook', 'tiktok');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "source" "Platform" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "funnelStage" "FunnelStage" NOT NULL,
    "eventType" "EventType" NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_eventId_key" ON "Event"("eventId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
