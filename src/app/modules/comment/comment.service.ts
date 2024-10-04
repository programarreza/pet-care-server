import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Content } from "../content/content.model";
import { TComment } from "./comment.interface";
import { Comment } from "./comment.model";
import mongoose from "mongoose";

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
  return result;
};

const deleteCommentIntoDB = async (commentId: string) => {
  const commentExist = await Comment.findById(commentId);
  if (!commentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found!😥😥");
  }

  const result = await Comment.findByIdAndDelete(commentId);
  return result;
};

const updateCommentIntoDB = async (
  commentId: string,
  updateComment: Record<string, any>
) => {
  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid Comment ID! 😥😥");
  }

  const commentExist = await Comment.findById(commentId);
  if (!commentExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Comment not found! 😥😥");
  }

  const { comment } = updateComment;

  if (typeof comment !== "string") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Comment must be a string! 😥😥"
    );
  }

  const result = await Comment.findByIdAndUpdate(
    commentId,
    { comment },
    {
      new: true,
      runValidators: true,
    }
  );

  return result;
};

export {
  createCommentIntoDB,
  getCommentsFromDB,
  deleteCommentIntoDB,
  updateCommentIntoDB,
};
