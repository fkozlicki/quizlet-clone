import { and, eq, notInArray, sql } from "drizzle-orm";

import type { Database, Transaction } from "../client";
import type {
  InsertFlashcard,
  InsertFolder,
  InsertFolderToStudySet,
  InsertStudySet,
  UpdateFlashcard,
  UpdateFolder,
  UpdateStudySet,
  UpdateUser,
} from "../schema";
import {
  Activity,
  Flashcard,
  Folder,
  FoldersToStudySets,
  StarredFlashcard,
  StudySet,
  User,
} from "../schema";

export function createActivity(db: Database, userId: string) {
  return db.insert(Activity).values({ userId });
}

export async function editFlashcard(db: Database, values: UpdateFlashcard) {
  const { id, ...rest } = values;

  return db
    .update(Flashcard)
    .set(rest)
    .where(eq(Flashcard.id, id))
    .returning()
    .then((res) => res[0]);
}

export async function createFolder(db: Database, values: InsertFolder) {
  return db
    .insert(Folder)
    .values(values)
    .returning()
    .then((res) => res[0]);
}

export async function editFolder(db: Database, values: UpdateFolder) {
  const { id, ...rest } = values;

  return db
    .update(Folder)
    .set(rest)
    .where(eq(Folder.id, id))
    .returning()
    .then((res) => res[0]);
}

export function deleteFolder(db: Database, id: string) {
  return db.delete(Folder).where(eq(Folder.id, id));
}

export function createFolderToStudySet(
  db: Database,
  values: InsertFolderToStudySet,
) {
  return db.insert(FoldersToStudySets).values(values);
}

export function deleteFolderToStudySet(
  db: Database,
  { folderId, studySetId }: InsertFolderToStudySet,
) {
  return db
    .delete(FoldersToStudySets)
    .where(
      and(
        eq(FoldersToStudySets.folderId, folderId),
        eq(FoldersToStudySets.studySetId, studySetId),
      ),
    );
}

export async function updateUser(db: Database, values: UpdateUser) {
  const { id, ...rest } = values;

  return db
    .update(User)
    .set(rest)
    .where(eq(User.id, id))
    .returning()
    .then((res) => res[0]);
}

export function deleteUser(db: Database, id: string) {
  return db.delete(User).where(eq(User.id, id));
}

export async function createStudySet(db: Transaction, values: InsertStudySet) {
  return db
    .insert(StudySet)
    .values(values)
    .onConflictDoUpdate({
      target: Flashcard.id,
      set: {
        title: sql`excluded.title`,
        description: sql`excluded.description`,
      },
    })
    .returning()
    .then((res) => res[0]);
}

export async function upsertFlashcards(
  db: Transaction,
  values: InsertFlashcard[],
) {
  return db
    .insert(Flashcard)
    .values(values)
    .onConflictDoUpdate({
      target: Flashcard.id,
      set: {
        term: sql`excluded.term`,
        definition: sql`excluded.definition`,
        position: sql`excluded.position`,
      },
    });
}

export async function updateStudySet(tx: Transaction, values: UpdateStudySet) {
  const { id, ...rest } = values;
  return tx
    .update(StudySet)
    .set(rest)
    .where(eq(StudySet.id, id))
    .returning()
    .then((res) => res[0]);
}

export async function deleteStudySet(db: Database, id: string) {
  return db
    .delete(StudySet)
    .where(eq(StudySet.id, id))
    .returning()
    .then((res) => res[0]);
}

export function createStarredFlashcard(
  db: Database,
  values: { userId: string; flashcardId: number },
) {
  return db.insert(StarredFlashcard).values(values).returning();
}

export function deleteStarredFlashcard(
  db: Database,
  { flashcardId, userId }: { userId: string; flashcardId: number },
) {
  return db
    .delete(StarredFlashcard)
    .where(
      and(
        eq(StarredFlashcard.userId, userId),
        eq(StarredFlashcard.flashcardId, flashcardId),
      ),
    );
}

export function deleteExcludedFlashcards(
  db: Transaction,
  { flashcards, studySetId }: { studySetId: string; flashcards: number[] },
) {
  return db
    .delete(Flashcard)
    .where(
      and(
        eq(Flashcard.studySetId, studySetId),
        notInArray(Flashcard.id, flashcards),
      ),
    );
}
