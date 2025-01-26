import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { Flashcard } from "./flashcard";
import { User } from "./user";

export const StarredFlashcard = pgTable(
  "starred_flashcards",
  {
    userId: uuid("user_id")
      .references(() => User.id, { onDelete: "cascade" })
      .notNull(),
    flashcardId: integer("flashcard_id")
      .references(() => Flashcard.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.flashcardId] }),
  }),
);

export const StarredFlashcardRelations = relations(
  StarredFlashcard,
  ({ one }) => ({
    user: one(User, {
      fields: [StarredFlashcard.userId],
      references: [User.id],
    }),
    flashcard: one(Flashcard, {
      fields: [StarredFlashcard.flashcardId],
      references: [Flashcard.id],
    }),
  }),
);
