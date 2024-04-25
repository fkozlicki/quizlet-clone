import { relations } from "drizzle-orm";
import { integer, serial, text, uuid } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { starredFlashcards } from "./starredFlashcard";
import { studySets } from "./studySet";

export const flashcards = pgTable("flashcard", {
  id: serial("id").notNull().primaryKey(),
  term: text("term").notNull().default(""),
  definition: text("definition").notNull().default(""),
  position: integer("position").notNull(),
  studySetId: uuid("study_set_id")
    .references(() => studySets.id, { onDelete: "cascade" })
    .notNull(),
});

export const flashcardsRelations = relations(flashcards, ({ one, many }) => ({
  studySet: one(studySets, {
    fields: [flashcards.studySetId],
    references: [studySets.id],
  }),
  starredFlashcards: many(starredFlashcards),
}));
