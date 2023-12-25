import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import dayjs from "dayjs";

export const activityRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const today = dayjs().startOf("day").toDate();

    const existingActivity = await ctx.prisma.activity.findFirst({
      where: {
        userId: ctx.session.user.id,
        date: {
          gte: today,
        },
      },
    });

    if (!existingActivity) {
      const activity = await ctx.prisma.activity.create({
        data: {
          userId: ctx.session.user.id,
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
