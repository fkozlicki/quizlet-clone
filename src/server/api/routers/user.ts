import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { hash } from "bcrypt";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        birthday: z.date(),
        email: z.string().email(),
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { birthday, email, username, password } = input;

      const exists = await ctx.prisma.user.findFirst({
        where: { email },
      });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      const hashedPassword = await hash(password, 12);

      const result = await ctx.prisma.user.create({
        data: {
          name: username,
          email,
          password: hashedPassword,
          birthday,
        },
      });

      return result;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Could not find user with id ${input.id}`,
        });

      return user;
    }),
});
