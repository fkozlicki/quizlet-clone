import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { SelectFlashcard } from "@acme/db/schema";
import { eq, inArray } from "@acme/db";
import {
  createStudySet,
  deleteExcludedFlashcards,
  deleteStudySet,
  updateStudySet,
  upsertFlashcards,
} from "@acme/db/mutations";
import {
  getOtherStudySets,
  getPopularStudySetsQuery,
  getStarredFlashcardsQuery,
  getStudySetFlashcardsQuery,
  getStudySetQuery,
  getStudySetWithFlashcardsQuery,
  getUserStudySetsQuery,
} from "@acme/db/queries";
import { Flashcard, Folder, FoldersToStudySets } from "@acme/db/schema";
import { CreateStudySetSchema, EditStudySetSchema } from "@acme/validators";

import type { TRPCContext } from "../trpc";
import { protectedProcedure, publicProcedure } from "../trpc";

const getStarredFlashcards = async (ctx: TRPCContext, studySetId: string) => {
  if (ctx.session) {
    return await getStarredFlashcardsQuery(ctx.db, {
      studySetId,
      userId: ctx.session.user.id,
    });
  }

  return [];
};

const generateMultipleChoiceCards = (
  flashcards: SelectFlashcard[],
  pool: SelectFlashcard[],
) => {
  return flashcards.map((card) => {
    const falseAnswers = pool
      .filter(({ id }) => id !== card.id)
      .sort(() => 0.5 - Math.random())
      .map((card) => card.definition)
      .slice(0, 3);

    const answers = [...falseAnswers, card.definition].sort(
      () => 0.5 - Math.random(),
    );

    return {
      ...card,
      answers,
    };
  });
};

export const studySetRouter = {
  popular: publicProcedure.query(async ({ ctx }) => {
    return await getPopularStudySetsQuery(ctx.db);
  }),
  allByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await getUserStudySetsQuery(ctx.db, input.userId);
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const studySet = await getStudySetWithFlashcardsQuery(ctx.db, input.id);

      if (!studySet) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Study set with provided id not found",
        });
      }

      const starredFlashcards = await getStarredFlashcards(ctx, input.id);

      const updatedFlashcards = studySet.flashcards.map((flashcard) => ({
        ...flashcard,
        starred: starredFlashcards.some(({ id }) => id === flashcard.id),
      }));

      // TODO: Get only session.user folders of this set
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
        flashcards: updatedFlashcards,
        folders: allFolders,
      };
    }),
  other: publicProcedure
    .input(z.object({ studySetId: z.string(), userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await getOtherStudySets(ctx.db, input);
    }),
  create: protectedProcedure
    .input(CreateStudySetSchema)
    .mutation(async ({ input, ctx }) => {
      const { title, description, flashcards } = input;

      const result = await ctx.db.transaction(async (tx) => {
        const newStudySet = await createStudySet(tx, {
          title,
          description,
          userId: ctx.session.user.id,
        });

        if (!newStudySet) {
          return null;
        }

        const values = flashcards.map((flashcard) => ({
          ...flashcard,
          studySetId: newStudySet.id,
        }));

        await upsertFlashcards(tx, values);

        return newStudySet;
      });

      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create study set",
        });
      }

      return result;
    }),
  combine: protectedProcedure
    .input(z.object({ id: z.string(), studySets: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const studySet = await getStudySetQuery(ctx.db, input.id);

      if (!studySet) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const flashcards = await ctx.db.query.Flashcard.findMany({
        where: inArray(Flashcard.studySetId, [studySet.id, ...input.studySets]),
      });

      const result = await ctx.db.transaction(async (tx) => {
        const newStudySet = await createStudySet(tx, {
          title: studySet.title,
          description: studySet.description,
          userId: ctx.session.user.id,
        });

        if (!newStudySet) {
          return null;
        }

        const values = flashcards.map((card, index) => ({
          position: index + 1,
          studySetId: newStudySet.id,
          term: card.term,
          definition: card.definition,
        }));

        await upsertFlashcards(tx, values);

        return newStudySet;
      });

      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create study set",
        });
      }

      return result;
    }),
  edit: protectedProcedure
    .input(EditStudySetSchema)
    .mutation(async ({ input, ctx }) => {
      const { flashcards, ...rest } = input;

      const present = flashcards
        .map((card) => card.id)
        .filter((i) => i !== undefined);

      const result = await ctx.db.transaction(async (tx) => {
        const updatedStudySet = await updateStudySet(tx, rest);

        if (!updatedStudySet) {
          return null;
        }

        await deleteExcludedFlashcards(tx, {
          studySetId: updatedStudySet.id,
          flashcards: present,
        });

        const values = flashcards.map((card) => ({
          ...card,
          studySetId: updatedStudySet.id,
        }));

        await upsertFlashcards(tx, values);

        return updatedStudySet;
      });

      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update study set",
        });
      }

      return result;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await deleteStudySet(ctx.db, input.id);
    }),
  matchCards: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const flashcards = await getStudySetFlashcardsQuery(ctx.db, input.id, {
        limit: 4,
      });

      const matchCards = flashcards
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
      const flashcards = await getStudySetFlashcardsQuery(ctx.db, input.id);

      const cards = generateMultipleChoiceCards(flashcards, flashcards);

      const starredFlashcards = await getStarredFlashcards(ctx, input.id);

      return cards.map((card) => ({
        ...card,
        starred: starredFlashcards.some(({ id }) => id === card.id),
      }));
    }),
  testCards: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const flashcards = await getStudySetFlashcardsQuery(ctx.db, input.id);

      const copy = [...flashcards];

      // multipleChoice should be 10% and minimum 1
      // write should be 10% and minimum 1
      // tureFalse should be the rest
      // f.e we have 4 cards, then multipleChoice - 1, write - 1, trueFalse - 2

      const tenPercent = Math.floor(0.1 * flashcards.length);
      const count = tenPercent < 1 ? 1 : tenPercent;

      // RANDOMIZING QUESTIONS
      //multipleChoice
      const multipleChoiceInitial = copy.splice(0, count);
      const multipleChoice = generateMultipleChoiceCards(
        multipleChoiceInitial,
        flashcards,
      );

      // written
      const written = copy.splice(0, count);

      // trueFalse
      const trueOrFalse = copy.map((card) => {
        const falseAnswer =
          flashcards
            .filter((el) => el.id !== card.id)
            .at(Math.floor(Math.random() * (flashcards.length - 1)))
            ?.definition ?? card.definition;

        const answer = Math.random() < 0.5 ? falseAnswer : card.definition;

        return { ...card, answer };
      });

      return {
        trueOrFalse,
        written,
        multipleChoice,
      };
    }),
} satisfies TRPCRouterRecord;
