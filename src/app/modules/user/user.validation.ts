import { z } from "zod";

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ invalid_type_error: "name is required" }),
    email: z.string({ invalid_type_error: "email is required" }),
    password: z.string({ invalid_type_error: "password is required" }),
    phone: z.string({ invalid_type_error: "phone is required" }),
    address: z.string({ invalid_type_error: "address is required" }),
    image: z.string({ invalid_type_error: "image is required" }),
    role: z.enum(["user", "admin"]).optional(),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

export { createUserValidationSchema, updateUserValidationSchema };
