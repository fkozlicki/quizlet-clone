import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as activity from "./schema/activity";
import * as auth from "./schema/auth";
import * as flashcard from "./schema/flashcard";
import * as folder from "./schema/folder";
import * as foldersToStudySets from "./schema/foldersToStudySets";
import * as starredFlashcard from "./schema/starredFlashcard";
import * as studySet from "./schema/studySet";

export const schema = {
  ...auth,
  ...flashcard,
  ...folder,
  ...studySet,
  ...foldersToStudySets,
  ...starredFlashcard,
  ...activity,
};

export { pgTable as tableCreator } from "./schema/_table";

export * from "drizzle-orm";

const connectionString = `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`;

const pool = new pg.Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
export type Flashcard = typeof schema.flashcards.$inferSelect;
export type Folder = typeof schema.folders.$inferSelect;
