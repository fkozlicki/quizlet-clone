import { z } from "zod";

export const editFlashcardSchema = z.object({
  id: z.string().min(1, "Id is required"),
  term: z.string().min(1, "Term is required"),
  definition: z.string().min(1, "Definition is required"),
});

export type EditFlashcardValues = z.infer<typeof editFlashcardSchema>;
