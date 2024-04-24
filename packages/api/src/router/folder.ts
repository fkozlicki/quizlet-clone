import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";

import { and, count, eq, schema } from "@acme/db";
import {
  AddSetSchema,
  CreateFolderSchema,
  EditFolderSchema,
} from "@acme/validators";

import { protectedProcedure, publicProcedure } from "../trpc";
import { selectStudySetList } from "./studySet";

export const folderRouter = {
  allByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db
        .select({
          id: schema.folders.id,
          name: schema.folders.name,
          userId: schema.folders.userId,
          slug: schema.folders.slug,
          studySetsCount: count(schema.studySets),
        })
        .from(schema.folders)
        .leftJoin(
          schema.foldersToStudySets,
          eq(schema.foldersToStudySets.folderId, schema.folders.id),
        )
        .leftJoin(
          schema.studySets,
          eq(schema.studySets.id, schema.foldersToStudySets.studySetId),
        )
        .groupBy(schema.folders.id)
        .where(eq(schema.folders.userId, input.userId));
    }),
  create: protectedProcedure
    .input(CreateFolderSchema)
    .mutation(async ({ input, ctx }) => {
      const [folder] = await ctx.db
        .insert(schema.folders)
        .values({
          ...input,
          slug: slugify(input.name),
          userId: ctx.session.user.id,
        })
        .returning();

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
      const folder = await ctx.db.query.folders.findFirst({
        where: eq(schema.folders.slug, input.slug),
        with: {
          user: true,
        },
      });

      if (!folder) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Folder not found",
        });
      }

      const studySets = await selectStudySetList(ctx.db)
        .leftJoin(
          schema.foldersToStudySets,
          eq(schema.studySets.id, schema.foldersToStudySets.studySetId),
        )
        .where(eq(schema.foldersToStudySets.folderId, folder.id));

      return { ...folder, studySets };
    }),
  addSet: protectedProcedure
    .input(AddSetSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.insert(schema.foldersToStudySets).values({
        folderId: input.folderId,
        studySetId: input.studySetId,
      });
    }),
  removeSet: protectedProcedure
    .input(AddSetSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db
        .delete(schema.foldersToStudySets)
        .where(
          and(
            eq(schema.foldersToStudySets.folderId, input.folderId),
            eq(schema.foldersToStudySets.studySetId, input.studySetId),
          ),
        );
    }),
  edit: protectedProcedure
    .input(EditFolderSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...values } = input;
      return await ctx.db
        .update(schema.folders)
        .set(values)
        .where(eq(schema.folders.id, id));
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db
        .delete(schema.folders)
        .where(eq(schema.folders.id, input.id));
    }),
} satisfies TRPCRouterRecord;
