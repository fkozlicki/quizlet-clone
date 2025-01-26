import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq } from "@acme/db";
import { User } from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.query.User.findFirst({
        where: eq(User.id, input.id),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User with provided id not found",
        });
      }

      return user;
    }),
  update: protectedProcedure
    .input(z.object({ image: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const [user] = await ctx.db
        .update(User)
        .set(input)
        .where(eq(User.id, ctx.session.user.id))
        .returning();

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      return user;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.delete(User).where(eq(User.id, input.id));
    }),
} satisfies TRPCRouterRecord;
