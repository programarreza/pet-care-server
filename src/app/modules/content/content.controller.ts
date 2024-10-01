import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { createContentIntoDB, getAllContentFromDB } from "./content.service";

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

export { createContent, getAllContent };
