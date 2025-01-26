import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, uuid } from "drizzle-orm/pg-core";

import { StarredFlashcard } from "./starredFlashcard";
import { StudySet } from "./studySet";

export const Flashcard = pgTable("flashcards", {
  id: serial("id").notNull().primaryKey(),
  term: text("term").notNull().default(""),
  definition: text("definition").notNull().default(""),
  position: integer("position").notNull(),
  studySetId: uuid("study_set_id")
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
