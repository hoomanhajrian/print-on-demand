/*
  Warnings:

  - You are about to drop the column `last_active` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_update` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "last_active",
DROP COLUMN "last_update",
ADD COLUMN     "active_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
