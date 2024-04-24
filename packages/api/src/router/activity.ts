import { eq, gte, schema } from "@acme/db";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const activityRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const today = new Date().toISOString().split("T")[0]!;

    const existing = await ctx.db.query.activities.findFirst({
      where: gte(schema.activities.date, today),
    });

    if (!existing) {
      const activity = await ctx.db.insert(schema.activities).values({
        userId: ctx.session.user.id,
      });

      return activity;
    }
  }),
  allByUser: protectedProcedure.query(async ({ ctx }) => {
    const activity = await ctx.db.query.activities.findMany({
      where: eq(schema.activities.userId, ctx.session.user.id),
    });

    return activity;
  }),
});
