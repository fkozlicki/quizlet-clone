import { relations } from "drizzle-orm";
import { integer, primaryKey, uuid } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { users } from "./auth";
import { flashcards } from "./flashcard";

export const starredFlashcards = pgTable(
  "starred_flashcard",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    flashcardId: integer("flashcard_id")
      .references(() => flashcards.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.flashcardId] }),
  }),
);

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
