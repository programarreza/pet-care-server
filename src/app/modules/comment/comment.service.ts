import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Content } from "../content/content.model";
import { TComment } from "./comment.interface";
import { Comment } from "./comment.model";

const createCommentIntoDB = async (commentData: TComment) => {
  const result = await Comment.create(commentData);
  return result;
};

const getCommentsFromDB = async (contentId: string) => {
  const contentExist = await Content.findById(contentId);
  if (!contentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found!😥😥");
  }

  const result = await Comment.find({ content: contentId }).populate("user");
  console.log("from service", result);
  return result;
};

export { createCommentIntoDB, getCommentsFromDB };
