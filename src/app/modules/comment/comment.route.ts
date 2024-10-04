import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
} from "./comment.controller";

const commentRoutes = Router();

commentRoutes.post("/create-comment", createComment);

commentRoutes.get("/:contentId", getComments);
commentRoutes.delete("/:contentId", deleteComment);

export default commentRoutes;
