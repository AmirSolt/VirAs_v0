-- CreateEnum
CREATE TYPE "ConfigType" AS ENUM ('FREE', 'TIER_ONE');

-- DropIndex
DROP INDEX "Profile_fb_messenger_id_idx";

-- CreateTable
CREATE TABLE "Config" (
    "id" "ConfigType" NOT NULL,
    "categorizer_system_message" TEXT NOT NULL,
    "categorizer_temperature" INTEGER NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Profile_fb_messenger_id_idx" ON "Profile" USING HASH ("fb_messenger_id");
