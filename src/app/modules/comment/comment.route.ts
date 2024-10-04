import { Router } from "express";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "./comment.controller";

const commentRoutes = Router();

commentRoutes.post("/create-comment", createComment);

commentRoutes.get("/:contentId", getComments);
commentRoutes.delete("/:commentId", deleteComment);
commentRoutes.patch("/:commentId", updateComment);

export default commentRoutes;
