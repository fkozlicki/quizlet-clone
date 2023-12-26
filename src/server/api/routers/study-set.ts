import type { Flashcard } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  createStudySetSchema,
  editStudySetSchema,
} from "../../../schemas/study-set";

type TrueOrFalse = Flashcard & {
  answer: string;
};

type MultipleChoice = Flashcard & {
  answers: string[];
};

export type StudySetTest = {
  multipleChoice: MultipleChoice[];
  trueOrFalse: TrueOrFalse[];
  written: Flashcard[];
};

export const studySetRouter = createTRPCRouter({
  getUserSets: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.studySet.findMany({
        where: {
          userId: input.id,
        },
        include: {
          user: true,
          cards: true,
        },
      });
    }),

  create: protectedProcedure
    .input(createStudySetSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.studySet.create({
        data: {
          userId: ctx.session.user.id,
          title: input.title,
          description: input.description,
          cards: {
            createMany: {
              data: input.cards,
            },
          },
        },
      });
    }),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const set = await ctx.prisma.studySet.findUnique({
        where: {
          id: input.id,
        },
        include: {
          user: {
            include: {
              studySets: {
                where: {
                  id: {
                    not: input.id,
                  },
                },
                include: {
                  user: true,
                  cards: true,
                },
              },
            },
          },
          cards: {
            orderBy: {
              position: "asc",
            },
          },
        },
      });

      if (!set) throw new TRPCError({ code: "NOT_FOUND" });

      return set;
    }),

  getRandomCards: publicProcedure
    .input(
      z.object({
        id: z.string(),
        count: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const cards = await ctx.prisma.flashcard.findMany({
        where: {
          studySetId: input.id,
        },
      });

      if (!cards) throw new TRPCError({ code: "NOT_FOUND" });

      cards.sort(() => 0.5 - Math.random());

      return cards.slice(0, input.count);
    }),

  getLearnSet: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const cards = await ctx.prisma.flashcard.findMany({
        where: {
          studySetId: input.id,
        },
      });

      if (!cards) throw new TRPCError({ code: "NOT_FOUND" });

      // COPYING CARDS FOR RANDOM ANSWERS
      const cardsCopy = [...cards];

      // ADDING 3 RANDOM ANSWERS + DEFINITION
      const learnSet = cards
        .map((card) => {
          const randomAnswers = cardsCopy
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map((card) => card.definition);
          const allAnswers = [...randomAnswers, card.definition].sort(
            () => 0.5 - Math.random()
          );
          return { ...card, answers: allAnswers };
        })
        .sort(() => 0.5 - Math.random());

      return learnSet;
    }),

  getTest: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const cards = await ctx.prisma.flashcard.findMany({
        where: {
          studySetId: input.id,
        },
      });

      if (!cards) throw new TRPCError({ code: "NOT_FOUND" });

      const cardsCopy = [...cards];
      // multipleChoice should be 10% and minimum 1
      // write should be 10% and minimum 1
      // tureFalse should be the rest
      // f.e we have 4 cards, then multipleChoice - 1, write - 1, trueFalse - 2

      const tenPercent = Math.floor(0.1 * cards.length);
      const count = tenPercent < 1 ? 1 : tenPercent;

      // RANDOMIZING QUESTIONS
      //multipleChoice
      const multipleChoiceWithoutAnswers = cardsCopy
        .sort(() => 0.5 - Math.random())
        .splice(0, count);
      const multipleChoice = multipleChoiceWithoutAnswers.map((question) => {
        const randomAnswers = [...cards]
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((card) => card.definition);
        return {
          ...question,
          answers: [...randomAnswers, question.definition],
        };
      });
      // written
      const written = cardsCopy.splice(0, count);
      // trueFalse
      const trueOrFalse = cardsCopy.map((card) => {
        const randomFalseAnswer = [...cards]
          .filter((el) => el.id !== card.id)
          .sort(() => 0.5 - Math.random())[0]?.definition;
        const answer = [randomFalseAnswer, card.definition][
          Math.floor(Math.random() * 2)
        ]!;
        return { ...card, answer };
      });

      const test: StudySetTest = {
        trueOrFalse,
        written,
        multipleChoice,
      };

      return test;
    }),

  editById: protectedProcedure
    .input(editStudySetSchema)
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.prisma.studySet.update({
        include: {
          cards: true,
        },
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
          cards: {
            deleteMany: {},
            createMany: { data: input.cards },
          },
        },
      });

      if (!updated)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Could not find post with id ${input.id}`,
        });

      return updated;
    }),
});
