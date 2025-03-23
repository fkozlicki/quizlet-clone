import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { FoldersToStudySets } from "./folderToStudySet";
import { User } from "./user";

export const Folder = pgTable("folder", {
  id: uuid().notNull().primaryKey().defaultRandom(),
  name: text().notNull(),
  description: text(),
  slug: text().notNull(),
  userId: uuid()
    .references(() => User.id, { onDelete: "cascade" })
    .notNull(),
});

export const FoldersRelations = relations(Folder, ({ one, many }) => ({
  user: one(User, {
    fields: [Folder.userId],
    references: [User.id],
  }),
  foldersToStudySets: many(FoldersToStudySets),
}));

export type InsertFolder = typeof Folder.$inferInsert;
export type UpdateFolder = Partial<InsertFolder> & { id: string };
