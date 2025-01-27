import { relations, sql } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { Account } from "./account";
import { Activity } from "./activity";
import { Folder } from "./folder";
import { StarredFlashcard } from "./starredFlashcard";
import { StudySet } from "./studySet";

export const User = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});

export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),
  folders: many(Folder),
  starredFlashcards: many(StarredFlashcard),
  studySets: many(StudySet),
  activities: many(Activity),
}));
