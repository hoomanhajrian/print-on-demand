/*
  Warnings:

  - The values [CLIENT,PRINTER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `printer_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `request_id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `PrintRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrinterProfile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'EDITOR', 'USER');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_printer_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_request_id_fkey";

-- DropForeignKey
ALTER TABLE "PrintRequest" DROP CONSTRAINT "PrintRequest_client_id_fkey";

-- DropForeignKey
ALTER TABLE "PrinterProfile" DROP CONSTRAINT "PrinterProfile_user_id_fkey";

-- DropIndex
DROP INDEX "Order_request_id_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "printer_id",
DROP COLUMN "request_id",
ADD COLUMN     "client_id" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';

-- DropTable
DROP TABLE "PrintRequest";

-- DropTable
DROP TABLE "PrinterProfile";

-- DropTable
DROP TABLE "Product";

-- CreateTable
CREATE TABLE "Gig" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT,
    "tags" TEXT[],
    "availableMaterials" TEXT[],
    "availableSizes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gig_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
