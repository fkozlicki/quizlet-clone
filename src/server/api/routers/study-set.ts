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
  getAll: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.studySet.findMany({
        where: {
          userId: input.userId,
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

      if (!set) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Could not find set with id ${input.id}`,
        });
      }

      return set;
    }),

  getLearnSet: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const cards = await ctx.prisma.flashcard.findMany({
        where: {
          studySetId: input.id,
        },
      });

      // COPYING CARDS FOR RANDOM ANSWERS
      const cardsCopy = [...cards].sort(() => 0.5 - Math.random());

      // ADDING 3 RANDOM ANSWERS + DEFINITION
      const learnSet = cardsCopy.map((multipleChoice) => {
        const answers = [
          ...cards
            .filter((card) => card.id !== multipleChoice.id)
            .sort(() => 0.5 - Math.random())
            .slice(0)
            .map((card) => card.definition),
          multipleChoice.definition,
        ].sort(() => 0.5 - Math.random());

        return { ...multipleChoice, answers };
      });

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

      const cardsCopy = [...cards].sort(() => 0.5 - Math.random());
      // multipleChoice should be 10% and minimum 1
      // write should be 10% and minimum 1
      // tureFalse should be the rest
      // f.e we have 4 cards, then multipleChoice - 1, write - 1, trueFalse - 2

      const tenPercent = Math.floor(0.1 * cards.length);
      const count = tenPercent < 1 ? 1 : tenPercent;

      // RANDOMIZING QUESTIONS
      //multipleChoice
      const multipleChoiceWithoutAnswers = cardsCopy.splice(0, count);
      const multipleChoice = multipleChoiceWithoutAnswers.map(
        (multipleChoice) => {
          const answers = [
            ...cards
              .filter((card) => card.id !== multipleChoice.id)
              .sort(() => 0.5 - Math.random())
              .slice(0)
              .map((card) => card.definition),
            multipleChoice.definition,
          ].sort(() => 0.5 - Math.random());

          return {
            ...multipleChoice,
            answers,
          };
        }
      );
      // written
      const written = cardsCopy.splice(0, count);
      // trueFalse
      const trueOrFalse = cardsCopy.map((card) => {
        const otherCards = cards.filter((el) => el.id !== card.id);
        const randomFalseAnswer =
          otherCards[Math.floor(Math.random() * otherCards.length)]!.definition;
        const answer =
          Math.random() < 0.5 ? randomFalseAnswer : card.definition;

        return { ...card, answer };
      });

      const test: StudySetTest = {
        trueOrFalse,
        written,
        multipleChoice,
      };

      return test;
    }),

  getMatchCards: publicProcedure
    .input(
      z.object({
        setId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const cards = await ctx.prisma.flashcard.findMany({
        where: {
          studySetId: input.setId,
        },
      });

      const MAX_CARDS = 4;

      const matchCards = cards
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(cards.length, MAX_CARDS))
        .map((card) => [
          { flashcardId: card.id, content: card.term },
          { flashcardId: card.id, content: card.definition },
        ])
        .flat()
        .sort(() => 0.5 - Math.random());

      return matchCards;
    }),

  edit: protectedProcedure
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

      return updated;
    }),
  delete: protectedProcedure
    .input(z.object({ setId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedStudySet = await ctx.prisma.studySet.delete({
        where: {
          id: input.setId,
        },
      });

      return deletedStudySet;
    }),
});
