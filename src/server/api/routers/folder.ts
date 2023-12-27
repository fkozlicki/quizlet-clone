import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { createFolderSchema, editFolderSchema } from "../../../schemas/folder";

export const folderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createFolderSchema)
    .mutation(async ({ input, ctx }) => {
      const { title, description } = input;

      const exists = await ctx.prisma.folder.findFirst({
        where: {
          title,
          userId: ctx.session.user.id,
        },
      });

      if (exists) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Folder with this title already exists.",
        });
      }

      const folder = await ctx.prisma.folder.create({
        data: {
          title,
          description,
          slug: slugify(title),
          userId: ctx.session.user.id,
        },
      });

      return folder;
    }),

  getAll: publicProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const folders = await ctx.prisma.folder.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          studySets: true,
        },
      });

      if (!folders)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Couldn't find user folders",
        });

      return folders;
    }),

  getByTitle: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        slug: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { userId, slug } = input;

      const folder = await ctx.prisma.folder.findFirst({
        where: {
          userId,
          slug,
        },
        include: {
          studySets: {
            include: {
              cards: true,
              user: true,
            },
          },
          user: true,
        },
      });

      return folder;
    }),

  addSet: protectedProcedure
    .input(
      z.object({
        folderId: z.string(),
        setId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const folder = await ctx.prisma.folder.update({
        where: {
          id: input.folderId,
        },
        data: {
          studySets: {
            connect: {
              id: input.setId,
            },
          },
        },
        include: {
          studySets: {
            include: {
              cards: true,
              user: true,
            },
          },
          user: true,
        },
      });

      return folder;
    }),

  removeSet: protectedProcedure
    .input(
      z.object({
        folderId: z.string(),
        setId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const folder = await ctx.prisma.folder.update({
        where: {
          id: input.folderId,
        },
        data: {
          studySets: {
            disconnect: {
              id: input.setId,
            },
          },
        },
        include: {
          studySets: {
            include: {
              cards: true,
              user: true,
            },
          },
          user: true,
        },
      });

      return folder;
    }),

  edit: protectedProcedure
    .input(editFolderSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, title, description } = input;

      const updated = await ctx.prisma.folder.update({
        where: {
          id,
        },
        data: {
          title,
          description,
          slug: slugify(title),
        },
      });

      if (!updated)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Couldn't update folder",
        });

      return updated;
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.folder.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
