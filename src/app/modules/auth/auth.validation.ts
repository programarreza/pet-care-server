import { z } from "zod";

const loginUserValidationSchema = z.object({
  body: z.object({
    email: z.string({ invalid_type_error: "email is required" }),
    password: z.string({ invalid_type_error: "password is required" }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z
      .string({
        required_error: "Refresh token is required ",
      })
      .optional(),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "User email is required",
    }),
  }),
});

export {
  loginUserValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
};
