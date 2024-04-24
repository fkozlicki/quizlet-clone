import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq, schema } from "@acme/db";

import { protectedProcedure } from "../trpc";

export const starredFlashcardRouter = {
  create: protectedProcedure
    .input(z.object({ flashcardId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db
        .insert(schema.starredFlashcards)
        .values({
          userId: ctx.session.user.id,
          flashcardId: input.flashcardId,
        })
        .returning();
    }),
  delete: protectedProcedure
    .input(z.object({ flashcardId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db
        .delete(schema.starredFlashcards)
        .where(
          and(
            eq(schema.starredFlashcards.userId, ctx.session.user.id),
            eq(schema.starredFlashcards.flashcardId, input.flashcardId),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
