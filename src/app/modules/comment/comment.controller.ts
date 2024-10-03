import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createCommentIntoDB } from "./comment.service";

const createComment = catchAsync(async (req, res) => {
  const result = await createCommentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment create successfully",
    data: result,
  });
});

export { createComment };
