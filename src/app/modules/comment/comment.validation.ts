import { z } from "zod";

export const CommentValidationSchema = z.object({
  user: z
    .string()
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid ObjectId format for user",
    })
    .optional(),
  content: z
    .string()
    .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
      message: "Invalid ObjectId format for content",
    })
    .optional(),
  comment: z.string().min(1, { message: "Comment is required" }),
});
