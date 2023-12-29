import { z } from "zod";

export const createFolderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullish(),
});

export type CreateFolderValues = z.infer<typeof createFolderSchema>;

export const editFolderSchema = createFolderSchema.merge(
  z.object({
    id: z.string().min(1, "Folder id is required"),
  })
);

export type EditFolderValues = z.infer<typeof editFolderSchema>;

export const addSetSchema = z.object({
  folderId: z.string(),
  setId: z.string(),
});
