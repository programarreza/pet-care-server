import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  createContentIntoDB,
  downvoteContentIntoDB,
  getAllContentFromDB,
  getMyContentsFromDB,
  updateStatusFromDB,
  upvoteContentIntoDB,
} from "./content.service";

const createContent = catchAsync(async (req, res) => {
  const result = await createContentIntoDB({
    ...req.body,
    image: req.file?.path,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Content post successfully",
    data: result,
  });
});

const getAllContent = catchAsync(async (req, res) => {
  const result = await getAllContentFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contents is retrieved successfully",
    data: result,
  });
});

const getMyContents = catchAsync(async (req, res) => {
  const { email } = req.query;
  const result = await getMyContentsFromDB(email as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Contents is retrieved successfully",
    data: result,
  });
});

const upvoteContent = catchAsync(async (req, res) => {
  const { contentId } = req.params;
  const { userId } = req.body;

  const result = await upvoteContentIntoDB(contentId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Upvote successfully!",
    data: result,
  });
});

const downvoteContent = catchAsync(async (req, res) => {
  const { contentId } = req.params;
  const { userId } = req.body;

  const result = await downvoteContentIntoDB(contentId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Downvote successfully!",
    data: result,
  });
});

const updateStatus = catchAsync(async (req, res) => {
  const { contentId } = req.params;
  const { status } = req.body;

  const result = await updateStatusFromDB(contentId, status);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Status change successfully!",
    data: result,
  });
});

export {
  createContent,
  getAllContent,
  getMyContents,
  upvoteContent,
  downvoteContent,
  updateStatus,
};
