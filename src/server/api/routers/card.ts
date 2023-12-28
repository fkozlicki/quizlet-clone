import { editFlashcardSchema } from "../../../schemas/flashcard";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const cardRouter = createTRPCRouter({
  edit: protectedProcedure
    .input(editFlashcardSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, term, definition } = input;
      const edited = await ctx.prisma.flashcard.update({
        where: {
          id,
        },
        data: {
          term,
          definition,
        },
      });

      return edited;
    }),
});
