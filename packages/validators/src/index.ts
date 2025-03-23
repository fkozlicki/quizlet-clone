import { z } from "zod";

export const CreateUserSchema = z.object({
  birthday: z.string(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
});

const FlashcardSchema = z.object({
  term: z.string().min(1, "Specify term of your flashcard"),
  definition: z.string().min(1, "Specify definition of your flashcard"),
  position: z.number(),
});

export const CreateStudySetSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  flashcards: z
    .array(FlashcardSchema)
    .min(4, "You have to create at least 4 flashcards"),
});

export type CreateStudySetValues = z.infer<typeof CreateStudySetSchema>;

export const EditStudySetSchema = CreateStudySetSchema.extend({
  id: z.string().min(1, "Id is required"),
  flashcards: z
    .array(
      FlashcardSchema.extend({
        id: z.number().optional(),
        studySetId: z.string().optional(),
      }),
    )
    .min(2, "You have to create at least 2 flashcards"),
});

export type EditStudySetValues = z.infer<typeof EditStudySetSchema>;

export const CreateFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required"),
  description: z.string().optional(),
});

export type CreateFolderValues = z.infer<typeof CreateFolderSchema>;

export const EditFolderSchema = CreateFolderSchema.merge(
  z.object({
    id: z.string().min(1, "Folder id is required"),
  }),
);

export type EditFolderValues = z.infer<typeof EditFolderSchema>;

export const AddSetSchema = z.object({
  folderId: z.string(),
  studySetId: z.string(),
});

export const EditFlashcardSchema = z.object({
  id: z.number(),
  term: z.string().min(1, "Term is required"),
  definition: z.string().min(1, "Definition is required"),
});
