import { z } from "zod";

export const createStudySetSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters long"),
  description: z.string().nullish(),
  cards: z
    .array(
      z.object({
        term: z.string(),
        definition: z.string(),
        position: z.number(),
      })
    )
    .min(2, "You have to create at least 2 cards"),
});

export type CreateStudySetValues = z.infer<typeof createStudySetSchema>;

export const editStudySetSchema = createStudySetSchema.merge(
  z.object({
    id: z.string().min(1, "Id is required"),
  })
);

export type EditStudySetValues = z.infer<typeof editStudySetSchema>;
