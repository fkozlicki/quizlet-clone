import { TRPCError } from "@trpc/server";
import { hash } from "bcrypt";
import { z } from "zod";

import { env } from "@/env";
import { PutObjectAclCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createUserSchema } from "../../../schemas/user";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  for (const key of keys) {
    delete user[key];
  }
  return user;
}

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ input, ctx }) => {
      const { birthday, email, name, password } = input;

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

      const user = await ctx.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          birthday,
        },
      });

      await ctx.prisma.account.create({
        data: {
          providerAccountId: user.id,
          userId: user.id,
          type: "credentials",
          provider: "credentials",
        },
      });

      return user;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        include: {
          sessions: true,
        },
        where: {
          id: input.id,
        },
      });

      return user;
    }),

  update: protectedProcedure
    .input(
      z.object({
        image: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          image: input.image,
        },
      });

      return exclude(user, ["password"]);
    }),

  delete: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.user.delete({
      where: {
        id: ctx.session.user.id,
      },
    });
  }),

  presignedUrl: protectedProcedure
    .input(z.object({ filename: z.string(), filetype: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const client = new S3Client({
        region: env._AWS_REGION,
        credentials: {
          accessKeyId: env._AWS_ACCESS_KEY,
          secretAccessKey: env._AWS_SECRET_KEY,
        },
      });

      const command = new PutObjectAclCommand({
        Bucket: `${env._AWS_BUCKET_NAME}/users/${ctx.session.user.id}`,
        Key: input.filename,
      });

      const preSignedUrl = await getSignedUrl(client, command, {
        expiresIn: 60,
      });

      return {
        preSignedUrl,
      };
    }),
});
