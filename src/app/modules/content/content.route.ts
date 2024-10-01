import { NextFunction, Request, Response, Router } from "express";
import { multerUpload } from "../../config/multer.config";
import validateRequest from "../../middleware/validateRequest";
import { createContent, getAllContent } from "./content.controller";
import { createContentValidationSchema } from "./content.validation";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middleware/auth";

const contentRoutes = Router();

contentRoutes.post(
  "/create-content",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  multerUpload.single("image"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(createContentValidationSchema),
  createContent
);

contentRoutes.get("/", getAllContent);

export default contentRoutes;
