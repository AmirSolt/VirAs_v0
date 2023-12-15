/*
  Warnings:

  - You are about to drop the column `tool_call_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `tool_call_name` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "tool_call_id",
DROP COLUMN "tool_call_name",
ADD COLUMN     "extra_json" JSONB;
