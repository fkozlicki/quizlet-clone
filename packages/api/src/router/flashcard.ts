import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";

import { editFlashcard } from "@acme/db/mutations";
import { EditFlashcardSchema } from "@acme/validators";

import { protectedProcedure } from "../trpc";

export const flashcardRouter = {
  edit: protectedProcedure
    .input(EditFlashcardSchema)
    .mutation(async ({ input, ctx }) => {
      const flashcard = await editFlashcard(ctx.db, input);

      if (!flashcard) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update flashcard",
        });
      }

      return flashcard;
    }),
} satisfies TRPCRouterRecord;
