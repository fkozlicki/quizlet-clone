import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";

import { StarredFlashcard } from "./starredFlashcard";
import { StudySet } from "./studySet";

export const Flashcard = pgTable("flashcard", {
  id: serial().notNull().primaryKey(),
  term: text().notNull().default(""),
  definition: text().notNull().default(""),
  position: integer().notNull(),
  studySetId: uuid()
    .references(() => StudySet.id, { onDelete: "cascade" })
    .notNull(),
});

export const flashcardsRelations = relations(Flashcard, ({ one, many }) => ({
  studySet: one(StudySet, {
    fields: [Flashcard.studySetId],
    references: [StudySet.id],
  }),
  starredFlashcards: many(StarredFlashcard),
}));

export type SelectFlashcard = typeof Flashcard.$inferSelect;
export type InsertFlashcard = typeof Flashcard.$inferInsert;
export type UpdateFlashcard = Partial<InsertFlashcard> & { id: number };
