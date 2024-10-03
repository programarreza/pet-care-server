import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  createContentIntoDB,
  getAllContentFromDB,
  getMyContentsFromDB,
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
  const result = await getAllContentFromDB();

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

export { createContent, getAllContent, getMyContents };
