import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const starredFlashcardRouter = createTRPCRouter({
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
      });

      return created;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        flashcardId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const delted = await ctx.prisma.starredFlashcard.delete({
        where: {
          flashcardId_userId: {
            userId: ctx.session.user.id,
            flashcardId: input.flashcardId,
          },
        },
      });

      return delted;
    }),
});
