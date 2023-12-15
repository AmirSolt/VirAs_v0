-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_profile_id_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
