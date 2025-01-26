import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";

import { and, count, eq } from "@acme/db";
import { Folder, FoldersToStudySets, StudySet } from "@acme/db/schema";
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
          id: Folder.id,
          name: Folder.name,
          userId: Folder.userId,
          slug: Folder.slug,
          studySetsCount: count(StudySet),
        })
        .from(Folder)
        .leftJoin(
          FoldersToStudySets,
          eq(FoldersToStudySets.folderId, Folder.id),
        )
        .leftJoin(StudySet, eq(StudySet.id, FoldersToStudySets.studySetId))
        .groupBy(Folder.id)
        .where(eq(Folder.userId, input.userId));
    }),
  create: protectedProcedure
    .input(CreateFolderSchema)
    .mutation(async ({ input, ctx }) => {
      const [folder] = await ctx.db
        .insert(Folder)
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
      const folder = await ctx.db.query.Folder.findFirst({
        where: eq(Folder.slug, input.slug),
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

      const sets = await selectStudySetList(ctx.db)
        .leftJoin(
          FoldersToStudySets,
          eq(StudySet.id, FoldersToStudySets.studySetId),
        )
        .where(eq(FoldersToStudySets.folderId, folder.id))
        .orderBy(StudySet.title);

      return { ...folder, studySets: sets };
    }),
  addSet: protectedProcedure
    .input(AddSetSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.insert(FoldersToStudySets).values({
        folderId: input.folderId,
        studySetId: input.studySetId,
      });
    }),
  removeSet: protectedProcedure
    .input(AddSetSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.db
        .delete(FoldersToStudySets)
        .where(
          and(
            eq(FoldersToStudySets.folderId, input.folderId),
            eq(FoldersToStudySets.studySetId, input.studySetId),
          ),
        );
    }),
  edit: protectedProcedure
    .input(EditFolderSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...values } = input;
      const [editedFolder] = await ctx.db
        .update(Folder)
        .set(values)
        .where(eq(Folder.id, id))
        .returning();

      if (!editedFolder) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Server error",
        });
      }

      return editedFolder;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await ctx.db.delete(Folder).where(eq(Folder.id, input.id));
    }),
} satisfies TRPCRouterRecord;
