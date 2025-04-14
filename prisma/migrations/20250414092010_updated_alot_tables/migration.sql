/*
  Warnings:

  - You are about to drop the column `address` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GigPrinters` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gigData` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_from_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_order_id_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_to_id_fkey";

-- DropForeignKey
ALTER TABLE "_GigPrinters" DROP CONSTRAINT "_GigPrinters_A_fkey";

-- DropForeignKey
ALTER TABLE "_GigPrinters" DROP CONSTRAINT "_GigPrinters_B_fkey";

-- AlterTable
ALTER TABLE "Gig" ADD COLUMN     "printers" TEXT[];

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "address",
ADD COLUMN     "gigData" JSONB NOT NULL,
ADD COLUMN     "receiverAddress" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "senderAddress" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "Review";

-- DropTable
DROP TABLE "_GigPrinters";

-- CreateTable
CREATE TABLE "GigReview" (
    "id" TEXT NOT NULL,
    "gig_id" TEXT NOT NULL,
    "from_id" TEXT NOT NULL,
    "to_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GigReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReview" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "from_id" TEXT NOT NULL,
    "to_id" TEXT NOT NULL,
    "order_id" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GigReview" ADD CONSTRAINT "GigReview_gig_id_fkey" FOREIGN KEY ("gig_id") REFERENCES "Gig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GigReview" ADD CONSTRAINT "GigReview_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GigReview" ADD CONSTRAINT "GigReview_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReview" ADD CONSTRAINT "UserReview_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReview" ADD CONSTRAINT "UserReview_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReview" ADD CONSTRAINT "UserReview_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReview" ADD CONSTRAINT "UserReview_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
