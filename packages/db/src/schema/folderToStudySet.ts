import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { Folder } from "./folder";
import { StudySet } from "./studySet";

export const FoldersToStudySets = pgTable(
  "folderToStudySet",
  {
    folderId: uuid("folderId")
      .notNull()
      .references(() => Folder.id, { onDelete: "cascade" }),
    studySetId: uuid("studySetId")
      .notNull()
      .references(() => StudySet.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.folderId, t.studySetId] }),
  }),
);

export const FolderToStudySetRelations = relations(
  FoldersToStudySets,
  ({ one }) => ({
    folder: one(Folder, {
      fields: [FoldersToStudySets.folderId],
      references: [Folder.id],
    }),
    studySet: one(StudySet, {
      fields: [FoldersToStudySets.studySetId],
      references: [StudySet.id],
    }),
  }),
);
