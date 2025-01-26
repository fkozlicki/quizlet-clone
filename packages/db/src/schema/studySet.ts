import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { Flashcard } from "./flashcard";
import { FoldersToStudySets } from "./folderToStudySet";
import { User } from "./user";

export const StudySet = pgTable("study_sets", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  userId: uuid("user_id")
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
