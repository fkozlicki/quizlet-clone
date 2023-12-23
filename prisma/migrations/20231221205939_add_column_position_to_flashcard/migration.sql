/*
  Warnings:

  - Added the required column `position` to the `Flashcard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Flashcard" ADD COLUMN     "position" INTEGER NOT NULL;
