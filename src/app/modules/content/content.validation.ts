import { z } from "zod";

// Validation schema for creating content
const createContentValidationSchema = z.object({
  body: z.object({
    user: z.string({ invalid_type_error: "User ID is required" }), // ObjectId validation
    content: z.string({ invalid_type_error: "Content is required" }),
    image: z
      .string({ invalid_type_error: "Image is required" })
      .nullable()
      .optional(),
    category: z.enum(["STORY", "TIP"], {
      invalid_type_error: "Invalid category",
    }),
    contentType: z.enum(["BASIC", "PREMIUM"], {
      invalid_type_error: "Invalid content type",
    }),
    status: z.enum(["PUBLISH", "UNPUBLISH"]).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

// Validation schema for updating content
const updateContentValidationSchema = z.object({
  body: z.object({
    content: z.string().optional(),
    image: z.string().nullable().optional(),
    category: z.enum(["STORY", "TIP"]).optional(),
    contentType: z.enum(["BASIC", "PREMIUM"]).optional(),
    status: z.enum(["PUBLISH", "UNPUBLISH"]).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export { createContentValidationSchema, updateContentValidationSchema };
