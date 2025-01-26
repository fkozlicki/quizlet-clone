import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";

import { eq } from "@acme/db";
import { Flashcard } from "@acme/db/schema";
import { EditFlashcardSchema } from "@acme/validators";

import { protectedProcedure } from "../trpc";

export const flashcardRouter = {
  edit: protectedProcedure
    .input(EditFlashcardSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...values } = input;

      const [flashcard] = await ctx.db
        .update(Flashcard)
        .set(values)
        .where(eq(Flashcard.id, id))
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
