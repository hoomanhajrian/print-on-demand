/*
  Warnings:

  - You are about to drop the column `identifier` on the `VerificationToken` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id,token]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `VerificationToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "VerificationToken_identifier_token_key";

-- AlterTable
ALTER TABLE "VerificationToken" DROP COLUMN "identifier",
ADD COLUMN     "id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_id_token_key" ON "VerificationToken"("id", "token");
