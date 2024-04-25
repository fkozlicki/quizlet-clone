import { relations } from "drizzle-orm";
import { primaryKey, uuid } from "drizzle-orm/pg-core";

import { pgTable } from "./_table";
import { folders } from "./folder";
import { studySets } from "./studySet";

export const foldersToStudySets = pgTable(
  "folders_to_study_sets",
  {
    folderId: uuid("folder_id")
      .notNull()
      .references(() => folders.id, { onDelete: "cascade" }),
    studySetId: uuid("study_set_id")
      .notNull()
      .references(() => studySets.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.folderId, t.studySetId] }),
  }),
);

export const foldersToStudySetsRelations = relations(
  foldersToStudySets,
  ({ one }) => ({
    folder: one(folders, {
      fields: [foldersToStudySets.folderId],
      references: [folders.id],
    }),
    studySet: one(studySets, {
      fields: [foldersToStudySets.studySetId],
      references: [studySets.id],
    }),
  }),
);
