import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import type { Database } from "@acme/db";
import { and, asc, count, desc, eq, inArray, not, schema } from "@acme/db";
import { CreateStudySetSchema, EditStudySetSchema } from "@acme/validators";

import type { TRPCContext } from "../trpc";
import { protectedProcedure, publicProcedure } from "../trpc";

export const selectStudySetList = (db: Database) =>
  db
    .select({
      id: schema.studySets.id,
      title: schema.studySets.title,
      flashcardCount: count(schema.flashcards.id),
      user: {
        id: schema.users.id,
        name: schema.users.name,
        image: schema.users.image,
      },
    })
    .from(schema.studySets)
    .leftJoin(
      schema.flashcards,
      eq(schema.studySets.id, schema.flashcards.studySetId),
    )
    .innerJoin(schema.users, eq(schema.studySets.userId, schema.users.id))
    .groupBy(schema.studySets.id, schema.users.id);

const selectStarredFlashcards = async (ctx: TRPCContext, studySetId: string) =>
  ctx.session
    ? await ctx.db
        .select({ id: schema.flashcards.id })
        .from(schema.flashcards)
        .leftJoin(
          schema.starredFlashcards,
          eq(schema.flashcards.id, schema.starredFlashcards.flashcardId),
        )
        .where(
          and(
            eq(schema.starredFlashcards.userId, ctx.session.user.id),
            eq(schema.flashcards.studySetId, studySetId),
          ),
        )
    : [];

export const studySetRouter = {
  popular: publicProcedure.query(async ({ ctx }) => {
    return await selectStudySetList(ctx.db)
      .limit(6)
      .orderBy(desc(schema.studySets.createdAt));
  }),
  allByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await selectStudySetList(ctx.db)
        .limit(6)
        .where(eq(schema.studySets.userId, input.userId));
    }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const studySet = await ctx.db.query.studySets.findFirst({
        where: eq(schema.studySets.id, input.id),
        with: {
          flashcards: {
            orderBy: [asc(schema.flashcards.position)],
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
            eq(schema.studySets.userId, studySet.userId),
            not(eq(schema.studySets.id, studySet.id)),
          ),
        );

      const starredFlashcards = await selectStarredFlashcards(ctx, input.id);

      const flashcards = studySet.flashcards.map((flashcard) => ({
        ...flashcard,
        starred: starredFlashcards.some((f) => f.id === flashcard.id),
      }));

      const folders = await ctx.db
        .select({ id: schema.folders.id })
        .from(schema.folders)
        .leftJoin(
          schema.foldersToStudySets,
          eq(schema.folders.id, schema.foldersToStudySets.folderId),
        )
        .where(eq(schema.foldersToStudySets.studySetId, studySet.id));

      return {
        ...studySet,
        user: { ...studySet.user, studySets: otherSets },
        flashcards,
        folders,
      };
    }),
  create: protectedProcedure
    .input(CreateStudySetSchema)
    .mutation(async ({ input, ctx }) => {
      const { title, description, flashcards } = input;

      const [newStudySet] = await ctx.db
        .insert(schema.studySets)
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

      await ctx.db.insert(schema.flashcards).values([
        ...flashcards.map((flashcard) => ({
          ...flashcard,
          studySetId: newStudySet.id,
        })),
      ]);

      return await ctx.db.query.studySets.findFirst({
        where: eq(schema.studySets.id, newStudySet.id),
      });
    }),
  edit: protectedProcedure
    .input(EditStudySetSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, title, description, flashcards } = input;

      const [updated] = await ctx.db
        .update(schema.studySets)
        .set({
          title,
          description,
        })
        .where(eq(schema.studySets.id, id))
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update study set",
        });
      }

      const currentFlashcards = (
        await ctx.db.query.flashcards.findMany({
          where: eq(schema.flashcards.studySetId, id),
        })
      ).map((card) => card.id);

      const toDeleteIds = flashcards
        .filter((card) => currentFlashcards.indexOf(card.id) < 0)
        .map((card) => card.id);

      const toUpdate = flashcards.filter(
        (card) => currentFlashcards.indexOf(card.id) >= 0,
      );

      if (toDeleteIds.length > 0) {
        await ctx.db
          .delete(schema.flashcards)
          .where(inArray(schema.flashcards.id, toDeleteIds));
      }

      const promises = toUpdate.map((card) =>
        ctx.db
          .update(schema.flashcards)
          .set(card)
          .where(eq(schema.flashcards.id, card.id)),
      );

      if (promises.length > 0) {
        await Promise.all(promises);
      }

      return updated;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [deleted] = await ctx.db
        .delete(schema.studySets)
        .where(eq(schema.studySets.id, input.id))
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
      const flashcards = await ctx.db.query.flashcards.findMany({
        where: eq(schema.flashcards.studySetId, input.id),
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
      const flashcards = await ctx.db.query.flashcards.findMany({
        where: eq(schema.flashcards.studySetId, input.id),
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
      const flashcards = await ctx.db.query.flashcards.findMany({
        where: eq(schema.flashcards.studySetId, input.id),
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
