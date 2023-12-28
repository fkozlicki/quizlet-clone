import dayjs from "dayjs";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
