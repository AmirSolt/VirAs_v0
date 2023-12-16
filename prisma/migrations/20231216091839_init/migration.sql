-- CreateTable
CREATE TABLE "Search" (
    "id" TEXT NOT NULL,
    "search_term" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "asins" TEXT[],

    CONSTRAINT "Search_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Search" ADD CONSTRAINT "Search_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
