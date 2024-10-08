import { NextFunction, Request, Response, Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { createUserValidationSchema } from "../user/user.validation";
import { forgetPassword, login, refreshToken, signup } from "./auth.controller";
import { forgetPasswordValidationSchema, loginUserValidationSchema } from "./auth.validation";
import { multerUpload } from "../../config/multer.config";

const authRoutes = Router();

authRoutes.post(
  "/signup",
  multerUpload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createUserValidationSchema),
  signup
);

authRoutes.post("/login", validateRequest(loginUserValidationSchema), login);

authRoutes.post(
  "/refresh-token",
  // validateRequest(refreshTokenValidationSchema),
  refreshToken
);

authRoutes.post(
  '/forget-password',
  validateRequest(forgetPasswordValidationSchema),
  forgetPassword,
);

export default authRoutes;
