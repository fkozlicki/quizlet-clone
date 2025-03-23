import type { TRPCRouterRecord } from "@trpc/server";

import { createActivity } from "@acme/db/mutations";
import { getTodayActivityQuery, getUserActivityQuery } from "@acme/db/queries";

import { protectedProcedure } from "../trpc";

export const activityRouter = {
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const existing = await getTodayActivityQuery(ctx.db);

    if (!existing) {
      return await createActivity(ctx.db, ctx.session.user.id);
    }
  }),
  allByUser: protectedProcedure.query(async ({ ctx }) => {
    return await getUserActivityQuery(ctx.db, ctx.session.user.id);
  }),
} satisfies TRPCRouterRecord;
