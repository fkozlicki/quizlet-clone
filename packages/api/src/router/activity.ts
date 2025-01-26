import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";

import { eq, gte } from "@acme/db";
import { Activity } from "@acme/db/schema";

import { protectedProcedure } from "../trpc";

export const activityRouter = {
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const today = new Date().toISOString().split("T")[0];

    if (!today) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Missing date error",
      });
    }

    const existing = await ctx.db.query.Activity.findFirst({
      where: gte(Activity.date, today),
    });

    if (!existing) {
      return await ctx.db.insert(Activity).values({
        userId: ctx.session.user.id,
      });
    }
  }),
  allByUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.Activity.findMany({
      where: eq(Activity.userId, ctx.session.user.id),
    });
  }),
} satisfies TRPCRouterRecord;
