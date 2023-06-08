import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const activityRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const existingActivity = await ctx.prisma.activity.findFirst({
      where: {
        userId: ctx.session.user.id,
        date: {
          gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        },
      },
    });

    if (!existingActivity) {
      const activity = await ctx.prisma.activity.create({
        data: {
          userId: ctx.session.user.id,
          date: now,
        },
      });

      if (!activity)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Could not create activity`,
        });

      return activity;
    }
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const activity = await ctx.prisma.activity.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });

    return activity;
  }),
});
