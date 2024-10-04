import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "./user.model";
import { TUser } from "./user.interface";
import mongoose from "mongoose";

const getUserProfileFromDB = async (email: string) => {
  const result = await User.findOne({ email: email })
    .populate("following")
    .populate("followers");

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

const createFollowingIntoDB = async (userId: string, followingId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const followingObjectId = new mongoose.Types.ObjectId(followingId);

    const currentUser = await User.findById(userObjectId).session(session);
    const userToFollow =
      await User.findById(followingObjectId).session(session);

    if (!currentUser || !userToFollow) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (currentUser.following.includes(followingObjectId)) {
      throw new AppError(httpStatus.CONFLICT, "Already following this user");
    }

    // Add following and follower
    currentUser.following.push(followingObjectId);
    userToFollow.followers.push(userObjectId);

    // Save both users within the session
    await currentUser.save({ session });
    await userToFollow.save({ session });

    await session.commitTransaction();
    session.endSession();

    const updatedUser = await User.findById(userObjectId)
      .populate("following")
      .populate("followers")
      .lean();

    return updatedUser;
  } catch (error) {
    // Rollback the transaction in case of an error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const unfollowUserFromDB = async (userId: string, followingId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const followingObjectId = new mongoose.Types.ObjectId(followingId);

    // Find the current user and the user to unfollow
    const currentUser = await User.findById(userObjectId).session(session);
    const userToUnfollow =
      await User.findById(followingObjectId).session(session);

    console.log({ currentUser, userToUnfollow });

    if (!currentUser || !userToUnfollow) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (!currentUser.following.includes(followingObjectId)) {
      throw new AppError(
        httpStatus.CONFLICT,
        "You are not following this user"
      );
    }

    // Remove the following relationship
    currentUser.following = currentUser.following.filter(
      (id) => !id.equals(followingObjectId)
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => !id.equals(userObjectId)
    );

    // Save both users
    await currentUser.save({ session });
    await userToUnfollow.save({ session });

    await session.commitTransaction();
    session.endSession();

    return currentUser;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateBlockStatusIntoDB = async (id: string, isBlock: boolean) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  const result = await User.findByIdAndUpdate(
    id,
    { isBlock: isBlock },
    { new: true }
  );

  return result;
};

export {
  getUserProfileFromDB,
  updateUserProfileFromDB,
  getAllUserFromDB,
  updateUserFromDB,
  deleteUserFromDB,
  createFollowingIntoDB,
  unfollowUserFromDB,
  updateBlockStatusIntoDB,
};
