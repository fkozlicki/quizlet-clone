/*
  Warnings:

  - The primary key for the `StarredFlashcard` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `StarredFlashcard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StarredFlashcard" DROP CONSTRAINT "StarredFlashcard_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "StarredFlashcard_pkey" PRIMARY KEY ("flashcardId", "userId");
