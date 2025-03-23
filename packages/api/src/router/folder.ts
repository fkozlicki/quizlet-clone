import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";

import {
  createFolder,
  createFolderToStudySet,
  deleteFolder,
  deleteFolderToStudySet,
  editFolder,
} from "@acme/db/mutations";
import { getFolderQuery, getUserFoldersQuery } from "@acme/db/queries";
import {
  AddSetSchema,
  CreateFolderSchema,
  EditFolderSchema,
} from "@acme/validators";

import { protectedProcedure, publicProcedure } from "../trpc";

export const folderRouter = {
  allByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await getUserFoldersQuery(ctx.db, input.userId);
    }),
  create: protectedProcedure
    .input(CreateFolderSchema)
    .mutation(async ({ input, ctx }) => {
      const slug = slugify(input.name);

      const folder = await createFolder(ctx.db, {
        ...input,
        slug,
        userId: ctx.session.user.id,
      });

      if (!folder) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create folder",
        });
      }

      return folder;
    }),
  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const folder = await getFolderQuery(ctx.db, input.slug);

      if (!folder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Folder not found",
        });
      }

      return folder;
    }),
  addSet: protectedProcedure
    .input(AddSetSchema)
    .mutation(async ({ input, ctx }) => {
      return await createFolderToStudySet(ctx.db, input);
    }),
  removeSet: protectedProcedure
    .input(AddSetSchema)
    .mutation(async ({ input, ctx }) => {
      return await deleteFolderToStudySet(ctx.db, input);
    }),
  edit: protectedProcedure
    .input(EditFolderSchema)
    .mutation(async ({ input, ctx }) => {
      const folder = await editFolder(ctx.db, input);

      if (!folder) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Server error",
        });
      }

      return folder;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await deleteFolder(ctx.db, input.id);
    }),
} satisfies TRPCRouterRecord;
