-- CreateTable
CREATE TABLE "StarredFlashcard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,

    CONSTRAINT "StarredFlashcard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StarredFlashcard" ADD CONSTRAINT "StarredFlashcard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarredFlashcard" ADD CONSTRAINT "StarredFlashcard_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
