import { Router } from "express";
import { createComment } from "./comment.controller";

const commentRoutes = Router();

commentRoutes.post("/create-comment", createComment);

export default commentRoutes;
