import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const cardRouter = createTRPCRouter({
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        term: z.string(),
        definition: z.string(),
      })
    )
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

      if (!edited)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Could not find card with id ${id}`,
        });

      return edited;
    }),
});
