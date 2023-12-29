import { z } from "zod";

export const createUserSchema = z.object({
  birthday: z.string(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
});
