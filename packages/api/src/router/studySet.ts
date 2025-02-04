import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Database } from "@acme/db/client";
import { and, asc, count, desc, eq, inArray, not } from "@acme/db";
import {
  Flashcard,
  Folder,
  FoldersToStudySets,
  StarredFlashcard,
  StudySet,
  User,
} from "@acme/db/schema";
import { CreateStudySetSchema, EditStudySetSchema } from "@acme/validators";

import type { TRPCContext } from "../trpc";
import { protectedProcedure, publicProcedure } from "../trpc";

export const selectStudySetList = (db: Database) =>
  db
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
    .leftJoin(Flashcard, eq(StudySet.id, Flashcard.studySetId))
    .innerJoin(User, eq(StudySet.userId, User.id))
    .groupBy(StudySet.id, User.id);

const selectStarredFlashcards = async (ctx: TRPCContext, studySetId: string) =>
  ctx.session
    ? await ctx.db
        .select({ id: Flashcard.id })
        .from(Flashcard)
        .leftJoin(
          StarredFlashcard,
          eq(Flashcard.id, StarredFlashcard.flashcardId),
        )
        .where(
          and(
            eq(StarredFlashcard.userId, ctx.session.user.id),
            eq(Flashcard.studySetId, studySetId),
          ),
        )
    : [];

export const studySetRouter = {
  popular: publicProcedure.query(async ({ ctx }) => {
    return await selectStudySetList(ctx.db)
      .limit(6)
      .orderBy(desc(StudySet.createdAt));
  }),
  allByUser: publicProcedure
    .input(z.object({ userId: z.string(), limit: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const query = selectStudySetList(ctx.db).where(
        eq(StudySet.userId, input.userId),
      );

      if (input.limit) {
        return await query.limit(input.limit);
      }

      return await query;
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const studySet = await ctx.db.query.StudySet.findFirst({
        where: eq(StudySet.id, input.id),
        with: {
          flashcards: {
            orderBy: [asc(Flashcard.position)],
          },
          user: true,
        },
      });

      if (!studySet) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Study set with provided id not found",
        });
      }

      const otherSets = await selectStudySetList(ctx.db)
        .limit(4)
        .where(
          and(
            eq(StudySet.userId, studySet.userId),
            not(eq(StudySet.id, studySet.id)),
          ),
        );

      const starredFlashcards = await selectStarredFlashcards(ctx, input.id);

      const allFlashcards = studySet.flashcards.map((flashcard) => ({
        ...flashcard,
        starred: starredFlashcards.some((f) => f.id === flashcard.id),
      }));

      const allFolders = await ctx.db
        .select({ id: Folder.id })
        .from(Folder)
        .leftJoin(
          FoldersToStudySets,
          eq(Folder.id, FoldersToStudySets.folderId),
        )
        .where(eq(FoldersToStudySets.studySetId, studySet.id));

      return {
        ...studySet,
        user: { ...studySet.user, studySets: otherSets },
        flashcards: allFlashcards,
        folders: allFolders,
      };
    }),
  create: protectedProcedure
    .input(CreateStudySetSchema)
    .mutation(async ({ input, ctx }) => {
      const { title, description, flashcards } = input;

      const [newStudySet] = await ctx.db
        .insert(StudySet)
        .values({
          title,
          description,
          userId: ctx.session.user.id,
        })
        .returning();

      if (!newStudySet) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create study set",
        });
      }

      await ctx.db.insert(Flashcard).values(
        flashcards.map((flashcard) => ({
          ...flashcard,
          studySetId: newStudySet.id,
        })),
      );

      return newStudySet;
    }),
  combine: protectedProcedure
    .input(z.object({ id: z.string(), studySets: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const studySet = await ctx.db.query.StudySet.findFirst({
        where: eq(StudySet.id, input.id),
      });

      if (!studySet) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [newStudySet] = await ctx.db
        .insert(StudySet)
        .values({
          title: studySet.title,
          description: studySet.description,
          userId: ctx.session.user.id,
        })
        .returning();

      if (!newStudySet) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create study set",
        });
      }

      const flashcards = await ctx.db.query.Flashcard.findMany({
        where: inArray(Flashcard.studySetId, [studySet.id, ...input.studySets]),
      });

      await ctx.db.insert(Flashcard).values(
        flashcards.map((card, index) => ({
          position: index + 1,
          studySetId: newStudySet.id,
          term: card.term,
          definition: card.definition,
        })),
      );

      return newStudySet;
    }),
  edit: protectedProcedure
    .input(EditStudySetSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, title, description, flashcards } = input;

      const [updated] = await ctx.db
        .update(StudySet)
        .set({
          title,
          description,
        })
        .where(eq(StudySet.id, id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update study set",
        });
      }

      const currentFlashcards = (
        await ctx.db.query.Flashcard.findMany({
          where: eq(Flashcard.studySetId, id),
        })
      ).map((card) => card.id);

      const toDeleteIds = currentFlashcards.filter(
        (cardId) => !flashcards.map((card) => card.id).includes(cardId),
      );

      if (toDeleteIds.length > 0) {
        await ctx.db
          .delete(Flashcard)
          .where(inArray(Flashcard.id, toDeleteIds));
      }

      type FlashcardToUpdate = Required<(typeof flashcards)[number]>;

      const toUpdate = flashcards.filter(
        (card) => card.id && currentFlashcards.includes(card.id),
      ) as FlashcardToUpdate[];

      const promises = toUpdate.map((card) =>
        ctx.db.update(Flashcard).set(card).where(eq(Flashcard.id, card.id)),
      );

      if (promises.length > 0) {
        await Promise.all(promises);
      }

      const toCreate = flashcards.filter((card) => card.id === undefined);

      if (toCreate.length > 0) {
        await ctx.db.insert(Flashcard).values([
          ...toCreate.map((flashcard) => ({
            ...flashcard,
            studySetId: id,
          })),
        ]);
      }

      return updated;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [deleted] = await ctx.db
        .delete(StudySet)
        .where(eq(StudySet.id, input.id))
        .returning();

      return deleted;
    }),
  matchCards: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const flashcards = await ctx.db.query.Flashcard.findMany({
        where: eq(Flashcard.studySetId, input.id),
      });

      const MAX_CARDS = 4;

      const matchCards = flashcards
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(flashcards.length, MAX_CARDS))
        .map((card) => [
          { flashcardId: card.id, content: card.term },
          { flashcardId: card.id, content: card.definition },
        ])
        .flat()
        .sort(() => 0.5 - Math.random());

      return matchCards;
    }),
  learnCards: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const flashcards = await ctx.db.query.Flashcard.findMany({
        where: eq(Flashcard.studySetId, input.id),
      });

      const starredFlashcards = await selectStarredFlashcards(ctx, input.id);

      // COPYING CARDS FOR RANDOM ANSWERS
      const flashcardsCopy = [
        ...flashcards.map((flashcard) => ({
          ...flashcard,
          starred: starredFlashcards.some((f) => f.id === flashcard.id),
        })),
      ].sort(() => 0.5 - Math.random());

      // ADDING 3 RANDOM ANSWERS + DEFINITION
      const learnCards = flashcardsCopy.map((multipleChoice) => {
        const answers = [
          ...flashcards
            .filter((card) => card.id !== multipleChoice.id)
            .sort(() => 0.5 - Math.random())
            .map((card) => card.definition)
            .slice(0, 3),
          multipleChoice.definition,
        ].sort(() => 0.5 - Math.random());

        return { ...multipleChoice, answers };
      });

      return learnCards;
    }),
  testCards: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const flashcards = await ctx.db.query.Flashcard.findMany({
        where: eq(Flashcard.studySetId, input.id),
      });

      const flashcardsCopy = [...flashcards].sort(() => 0.5 - Math.random());

      // multipleChoice should be 10% and minimum 1
      // write should be 10% and minimum 1
      // tureFalse should be the rest
      // f.e we have 4 cards, then multipleChoice - 1, write - 1, trueFalse - 2

      const tenPercent = Math.floor(0.1 * flashcards.length);
      const count = tenPercent < 1 ? 1 : tenPercent;

      // RANDOMIZING QUESTIONS
      //multipleChoice
      const multipleChoiceWithoutAnswers = flashcardsCopy.splice(0, count);
      const multipleChoice = multipleChoiceWithoutAnswers.map(
        (multipleChoice) => {
          const answers = [
            ...flashcards
              .filter((card) => card.id !== multipleChoice.id)
              .sort(() => 0.5 - Math.random())
              .map((card) => card.definition),
            multipleChoice.definition,
          ]
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

          return {
            ...multipleChoice,
            answers,
          };
        },
      );
      // written
      const written = flashcardsCopy.splice(0, count);
      // trueFalse
      const trueOrFalse = flashcardsCopy.map((card) => {
        const otherCards = flashcards.filter((el) => el.id !== card.id);
        const randomFalseAnswer =
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          otherCards[Math.floor(Math.random() * otherCards.length)]!.definition;
        const answer =
          Math.random() < 0.5 ? randomFalseAnswer : card.definition;

        return { ...card, answer };
      });

      return {
        trueOrFalse,
        written,
        multipleChoice,
      };
    }),
} satisfies TRPCRouterRecord;
