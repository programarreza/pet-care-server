import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { createUserValidationSchema } from "../user/user.validation";
import { login, refreshToken, signup } from "./auth.controller";
import { loginUserValidationSchema } from "./auth.validation";

const authRoutes = Router();

authRoutes.post("/signup", validateRequest(createUserValidationSchema), signup);
authRoutes.post("/login", validateRequest(loginUserValidationSchema), login);

authRoutes.post(
  "/refresh-token",
  // validateRequest(refreshTokenValidationSchema),
  refreshToken
);

export default authRoutes;
