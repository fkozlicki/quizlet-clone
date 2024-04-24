import { relations } from "drizzle-orm";
import { serial, uuid } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { users } from "./auth";
import { flashcards } from "./flashcard";

export const starredFlashcards = pgTable("starred_flashcard", {
  userId: uuid("user_id").notNull(),
  flashcardId: serial("flashcard_id").notNull(),
});

export const starredFlashcardsRelations = relations(
  starredFlashcards,
  ({ one }) => ({
    user: one(users, {
      fields: [starredFlashcards.userId],
      references: [users.id],
    }),
    flashcard: one(flashcards, {
      fields: [starredFlashcards.flashcardId],
      references: [flashcards.id],
    }),
  }),
);
