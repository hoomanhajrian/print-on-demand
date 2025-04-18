-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryGig" (
    "categoryId" TEXT NOT NULL,
    "gigId" TEXT NOT NULL,

    CONSTRAINT "CategoryGig_pkey" PRIMARY KEY ("categoryId","gigId")
);

-- CreateTable
CREATE TABLE "_CategoryGigs" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CategoryGigs_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryGigs_B_index" ON "_CategoryGigs"("B");

-- AddForeignKey
ALTER TABLE "CategoryGig" ADD CONSTRAINT "CategoryGig_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryGig" ADD CONSTRAINT "CategoryGig_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryGigs" ADD CONSTRAINT "_CategoryGigs_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryGigs" ADD CONSTRAINT "_CategoryGigs_B_fkey" FOREIGN KEY ("B") REFERENCES "Gig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
