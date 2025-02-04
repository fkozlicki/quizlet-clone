import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { Flashcard } from "./flashcard";
import { FoldersToStudySets } from "./folderToStudySet";
import { User } from "./user";

export const StudySet = pgTable("study_set", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  title: text().notNull(),
  description: text(),
  createdAt: timestamp({ mode: "date" }).notNull().defaultNow(),
  userId: uuid()
    .references(() => User.id, { onDelete: "cascade" })
    .notNull(),
});

export const StudySetRelations = relations(StudySet, ({ many, one }) => ({
  flashcards: many(Flashcard),
  foldersToStudySets: many(FoldersToStudySets),
  user: one(User, {
    fields: [StudySet.userId],
    references: [User.id],
  }),
}));
