import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";

import { eq, schema } from "@acme/db";
import { EditFlashcardSchema } from "@acme/validators";

import { protectedProcedure } from "../trpc";

export const flashcardRouter = {
  edit: protectedProcedure
    .input(EditFlashcardSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...values } = input;

      const [flashcard] = await ctx.db
        .update(schema.flashcards)
        .set(values)
        .where(eq(schema.flashcards.id, id))
        .returning();

      if (!flashcard) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update flashcard",
        });
      }

      return flashcard;
    }),
} satisfies TRPCRouterRecord;
