import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { eq, schema } from "@acme/db";

import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(schema.users.id, input.id),
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
        .update(schema.users)
        .set(input)
        .where(eq(schema.users.id, ctx.session.user.id))
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
      return await ctx.db
        .delete(schema.users)
        .where(eq(schema.users.id, input.id));
    }),
} satisfies TRPCRouterRecord;
