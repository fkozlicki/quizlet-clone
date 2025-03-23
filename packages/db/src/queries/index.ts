import { formatISO } from "date-fns";
import { and, asc, count, desc, eq, gte, not, sql } from "drizzle-orm";

import type { Database } from "../client";
import {
  Activity,
  Flashcard,
  Folder,
  FoldersToStudySets,
  StarredFlashcard,
  StudySet,
  User,
} from "../schema";

export function getTodayActivityQuery(db: Database) {
  const today = formatISO(new Date(), {
    representation: "date",
  });

  return db.query.Activity.findFirst({
    where: gte(Activity.date, today),
  });
}

export function getUserActivityQuery(db: Database, userId: string) {
  return db.query.Activity.findMany({
    where: eq(Activity.userId, userId),
  });
}

export function getUserFoldersQuery(db: Database, userId: string) {
  return db
    .select({
      id: Folder.id,
      name: Folder.name,
      slug: Folder.slug,
      userId: Folder.userId,
      studySetsCount: count(StudySet),
    })
    .from(Folder)
    .leftJoin(FoldersToStudySets, eq(FoldersToStudySets.folderId, Folder.id))
    .leftJoin(StudySet, eq(StudySet.id, FoldersToStudySets.studySetId))
    .groupBy(Folder.id)
    .where(eq(Folder.userId, userId));
}

function getStudySetsQuery(db: Database) {
  return db
    .select({
      id: StudySet.id,
      title: StudySet.title,
      flashcardCount: count(Flashcard.id),
      user: {
        id: User.id,
        name: User.name,
        image: User.image,
      },
    })
    .from(StudySet)
    .innerJoin(Flashcard, eq(StudySet.id, Flashcard.studySetId))
    .innerJoin(User, eq(StudySet.userId, User.id))
    .groupBy(StudySet.id, User.id);
}

export async function getFolderQuery(db: Database, slug: string) {
  const folder = await db.query.Folder.findFirst({
    where: eq(Folder.slug, slug),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!folder) {
    return undefined;
  }

  const studySets = await getStudySetsQuery(db)
    .leftJoin(
      FoldersToStudySets,
      eq(StudySet.id, FoldersToStudySets.studySetId),
    )
    .where(eq(FoldersToStudySets.folderId, folder.id))
    .orderBy(sql`lower(${StudySet.title})`);

  return { ...folder, studySets };
}

export function getUserQuery(db: Database, id: string) {
  return db.query.User.findFirst({
    where: eq(User.id, id),
  });
}

export function getPopularStudySetsQuery(db: Database) {
  return db
    .select({
      id: StudySet.id,
      title: StudySet.title,
      flashcardCount: count(Flashcard.id),
      user: {
        id: User.id,
        name: User.name,
        image: User.image,
      },
      starCount: count(StarredFlashcard.flashcardId).as("startCount"),
    })
    .from(StudySet)
    .innerJoin(Flashcard, eq(StudySet.id, Flashcard.studySetId))
    .innerJoin(User, eq(StudySet.userId, User.id))
    .leftJoin(StarredFlashcard, eq(StarredFlashcard.flashcardId, Flashcard.id))
    .groupBy(StudySet.id, User.id)
    .orderBy(desc(sql`count(${StarredFlashcard.flashcardId})`))
    .limit(8);
}

export function getLatestStudySets(db: Database) {
  return getStudySetsQuery(db).orderBy(desc(StudySet.createdAt)).limit(8);
}

export function getUserStudySetsQuery(db: Database, userId: string) {
  return getStudySetsQuery(db).where(eq(StudySet.userId, userId)).limit(8);
}

export function getStudySetQuery(db: Database, id: string) {
  return db.query.StudySet.findFirst({
    where: eq(StudySet.id, id),
  });
}

export function getStudySetWithFlashcardsQuery(db: Database, id: string) {
  return db.query.StudySet.findFirst({
    where: eq(StudySet.id, id),
    with: {
      flashcards: {
        orderBy: [asc(Flashcard.position)],
      },
      user: true,
    },
  });
}

export function getStarredFlashcardsQuery(
  db: Database,
  { studySetId, userId }: { studySetId: string; userId: string },
) {
  return db
    .select({ id: Flashcard.id })
    .from(Flashcard)
    .leftJoin(StarredFlashcard, eq(Flashcard.id, StarredFlashcard.flashcardId))
    .where(
      and(
        eq(StarredFlashcard.userId, userId),
        eq(Flashcard.studySetId, studySetId),
      ),
    );
}

export function getOtherStudySets(
  db: Database,
  { studySetId, userId }: { studySetId: string; userId: string },
) {
  return getStudySetsQuery(db)
    .where(and(eq(StudySet.userId, userId), not(eq(StudySet.id, studySetId))))
    .limit(4);
}

export function getStudySetFlashcardsQuery(
  db: Database,
  id: string,
  { limit }: { limit?: number } = {},
) {
  return db.query.Flashcard.findMany({
    where: eq(Flashcard.studySetId, id),
    orderBy: sql`RANDOM()`,
    limit,
  });
}
