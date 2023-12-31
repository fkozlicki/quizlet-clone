import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const starredFlashcardRouter = createTRPCRouter({
  getSetCards: protectedProcedure
    .input(
      z.object({
        setId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const starredFlashcards = await ctx.prisma.starredFlashcard.findMany({
        where: {
          flashcard: {
            studySetId: input.setId,
          },
          userId: ctx.session.user.id,
        },
        include: {
          flashcard: true,
        },
      });

      return starredFlashcards;
    }),
  create: protectedProcedure
    .input(
      z.object({
        flashcardId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const created = await ctx.prisma.starredFlashcard.create({
        data: {
          userId: ctx.session.user.id,
          flashcardId: input.flashcardId,
        },
        include: {
          flashcard: true,
        },
      });

      return created;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        starredId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const delted = await ctx.prisma.starredFlashcard.delete({
        where: {
          id: input.starredId,
        },
      });

      return delted;
    }),
});
