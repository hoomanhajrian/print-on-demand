/*
  Warnings:

  - You are about to drop the column `availableMaterials` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `availableSizes` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Gig` table. All the data in the column will be lost.
  - You are about to drop the column `client_id` on the `Review` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Gig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `printer_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_id` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_id` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_client_id_fkey";

-- AlterTable
ALTER TABLE "Gig" DROP COLUMN "availableMaterials",
DROP COLUMN "availableSizes",
DROP COLUMN "name",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "address" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "printer_id" TEXT NOT NULL,
ALTER COLUMN "client_id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "client_id",
ADD COLUMN     "from_id" TEXT NOT NULL,
ADD COLUMN     "to_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT DEFAULT '';

-- CreateTable
CREATE TABLE "Printer" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL DEFAULT '',
    "model" TEXT NOT NULL DEFAULT '',
    "max_dimentions" JSONB NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Printer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaterialCharge" (
    "id" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "chargePerHour" DOUBLE PRECISION NOT NULL,
    "printer_id" TEXT NOT NULL,

    CONSTRAINT "MaterialCharge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GigPrinters" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GigPrinters_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GigPrinters_B_index" ON "_GigPrinters"("B");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_printer_id_fkey" FOREIGN KEY ("printer_id") REFERENCES "Printer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Printer" ADD CONSTRAINT "Printer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaterialCharge" ADD CONSTRAINT "MaterialCharge_printer_id_fkey" FOREIGN KEY ("printer_id") REFERENCES "Printer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GigPrinters" ADD CONSTRAINT "_GigPrinters_A_fkey" FOREIGN KEY ("A") REFERENCES "Gig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GigPrinters" ADD CONSTRAINT "_GigPrinters_B_fkey" FOREIGN KEY ("B") REFERENCES "Printer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
