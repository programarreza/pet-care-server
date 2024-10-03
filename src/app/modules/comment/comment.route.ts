import { Router } from "express";
import { createComment, getComments } from "./comment.controller";

const commentRoutes = Router();

commentRoutes.post("/create-comment", createComment);

commentRoutes.get("/:contentId", getComments)

export default commentRoutes;
