/*
  Warnings:

  - You are about to drop the column `folderId` on the `StudySet` table. All the data in the column will be lost.
  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudySet" DROP CONSTRAINT "StudySet_folderId_fkey";

-- AlterTable
ALTER TABLE "StudySet" DROP COLUMN "folderId";

-- DropTable
DROP TABLE "Example";

-- CreateTable
CREATE TABLE "_FolderToStudySet" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FolderToStudySet_AB_unique" ON "_FolderToStudySet"("A", "B");

-- CreateIndex
CREATE INDEX "_FolderToStudySet_B_index" ON "_FolderToStudySet"("B");

-- AddForeignKey
ALTER TABLE "_FolderToStudySet" ADD CONSTRAINT "_FolderToStudySet_A_fkey" FOREIGN KEY ("A") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolderToStudySet" ADD CONSTRAINT "_FolderToStudySet_B_fkey" FOREIGN KEY ("B") REFERENCES "StudySet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
