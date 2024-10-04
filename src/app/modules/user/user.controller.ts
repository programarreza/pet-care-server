import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  createFollowingIntoDB,
  deleteUserFromDB,
  getAllUserFromDB,
  getUserProfileFromDB,
  updateUserFromDB,
  updateUserProfileFromDB,
} from "./user.service";

const getUserProfile = catchAsync(async (req, res) => {
  const { email } = req.query;
  const result = await getUserProfileFromDB(email as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const getAllUser = catchAsync(async (req, res) => {
  const result = await getAllUserFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users is retrieved successfully",
    data: result,
  });
});

const updateUserProfile = catchAsync(async (req, res) => {
  const { email } = req.user;
  const result = await updateUserProfileFromDB(email, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updateUserFromDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await deleteUserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

const followUser = catchAsync(async (req, res) => {
  const { userId, followingId } = req.body;

  const result = await createFollowingIntoDB(userId, followingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User followed successfully",
    data: result,
  });
});

export {
  getUserProfile,
  updateUserProfile,
  getAllUser,
  updateUser,
  deleteUser,
  followUser,
};
