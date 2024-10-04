import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  createCommentIntoDB,
  deleteCommentIntoDB,
  getCommentsFromDB,
  updateCommentIntoDB,
} from "./comment.service";

const createComment = catchAsync(async (req, res) => {
  const result = await createCommentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment create successfully",
    data: result,
  });
});

const getComments = catchAsync(async (req, res) => {
  const { contentId } = req.params;
  const result = await getCommentsFromDB(contentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment create successfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const result = await deleteCommentIntoDB(commentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment is deleted successfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const result = await updateCommentIntoDB(commentId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment is updated successfully",
    data: result,
  });
});

export { createComment, getComments, deleteComment, updateComment };
