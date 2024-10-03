import { TComment } from "./comment.interface";
import { Comment } from "./comment.model";

const createCommentIntoDB = async (commentData: TComment) => {
  const result = await Comment.create(commentData);
  return result;
};

export { createCommentIntoDB };
