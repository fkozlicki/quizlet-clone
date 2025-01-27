import { relations } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

import { FoldersToStudySets } from "./folderToStudySet";
import { User } from "./user";

export const Folder = pgTable("folder", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull(),
  userId: uuid("userId")
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
