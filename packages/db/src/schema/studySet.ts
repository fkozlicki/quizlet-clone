import { relations } from "drizzle-orm";
import { text, timestamp, uuid } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { users } from "./auth";
import { flashcards } from "./flashcard";
import { foldersToStudySets } from "./foldersToStudySets";

export const studySets = pgTable("study_set", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  userId: uuid("user_id").notNull(),
});

export const studySetsRelations = relations(studySets, ({ many, one }) => ({
  flashcards: many(flashcards),
  foldersToStudySets: many(foldersToStudySets),
  user: one(users, {
    fields: [studySets.userId],
    references: [users.id],
  }),
}));
