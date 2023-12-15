-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('USER', 'ASSISTANT', 'TOOL');

-- CreateEnum
CREATE TYPE "MessageDir" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "ConfigType" AS ENUM ('FREE', 'TIER_ONE');

-- CreateTable
CREATE TABLE "Config" (
    "id" "ConfigType" NOT NULL,
    "categorizer_system_message" TEXT NOT NULL,
    "categorizer_temperature" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fb_messenger_id" TEXT NOT NULL,
    "country" TEXT,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT,
    "tool_call_id" TEXT,
    "tool_call_name" TEXT,
    "profile_id" TEXT NOT NULL,
    "message_dir" "MessageDir" NOT NULL,
    "role" "MessageRole" NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_fb_messenger_id_key" ON "Profile"("fb_messenger_id");

-- CreateIndex
CREATE INDEX "Profile_fb_messenger_id_idx" ON "Profile" USING HASH ("fb_messenger_id");

-- CreateIndex
CREATE INDEX "Message_created_at_idx" ON "Message"("created_at");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
