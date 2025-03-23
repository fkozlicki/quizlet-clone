import { relations, sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { Account } from "./account";
import { Activity } from "./activity";
import { Folder } from "./folder";
import { StarredFlashcard } from "./starredFlashcard";
import { StudySet } from "./studySet";

export const User = pgTable("user", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull(),
  emailVerified: timestamp({
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar({ length: 255 }),
});

export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),
  folders: many(Folder),
  starredFlashcards: many(StarredFlashcard),
  studySets: many(StudySet),
  activities: many(Activity),
}));

export type UpdateUser = Partial<typeof User.$inferInsert> & { id: string };
