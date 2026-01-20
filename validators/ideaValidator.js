import z from "zod/v4";

export const createIdeaSchema = z.object({
  title: z.string().min(5, "title must be least 5 character"),
  description: z
    .string()
    .min(10, "description must be least 10 character")
    .max(255, "description must be max length 255 character"),
  summary: z
    .string()
    .min(10, "summary must be least 10 character")
    .max(255, "summary must be max length 255 character"),
  tags: z.string().optional(),
});

export const updateIdeaSchema = createIdeaSchema.partial();
