/*
  Warnings:

  - You are about to drop the column `country` on the `Profile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Country" AS ENUM ('US', 'CA', 'UK');

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "country",
ADD COLUMN     "countryCode" TEXT;
