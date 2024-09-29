import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "./user.model";
import { TUser } from "./user.interface";

const getUserProfileFromDB = async (email: string) => {
  const result = await User.findOne({ email: email });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found !");
  }

  return result;
};

const getAllUserFromDB = async () => {
  const result = await User.find();

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found !");
  }

  return result;
};

const updateUserProfileFromDB = async (
  email: string,
  payload: Partial<TUser>
) => {
  // check if the user is exist by email
  const user = await User.isUserExistsByEmail(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found !");
  }

  //   checking if the email is not updated
  if (payload?.email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your email address is not changing"
    );
  }

  // find user and profile update
  const result = await User.findOneAndUpdate({ email }, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Failed to update user profile");
  }

  return result;
};

const updateUserFromDB = async (id: string, payload: Partial<TUser>) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found !");
  }

  //   checking if the email is not updated
  if (payload?.email) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Your email address is not changing"
    );
  }

  // find user and profile update
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Failed to update user ");
  }

  return result;
};

const deleteUserFromDB = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found !");
  }

  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Failed to delete user ");
  }

  return result;
};

export {
  getUserProfileFromDB,
  updateUserProfileFromDB,
  getAllUserFromDB,
  updateUserFromDB,
  deleteUserFromDB,
};
