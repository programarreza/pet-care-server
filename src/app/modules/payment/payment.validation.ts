import { z } from "zod";

const paymentValidationSchema = z.object({
  body: z.object({
    user: z.string({ invalid_type_error: "User ID is required" }),
  }),
});

export { paymentValidationSchema };
