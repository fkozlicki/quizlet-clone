import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { deleteUser, updateUser } from "@acme/db/mutations";
import { getUserQuery } from "@acme/db/queries";

import { protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = {
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await getUserQuery(ctx.db, input.id);

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
      const user = await updateUser(ctx.db, {
        ...input,
        id: ctx.session.user.id,
      });

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
      return await deleteUser(ctx.db, input.id);
    }),
} satisfies TRPCRouterRecord;
