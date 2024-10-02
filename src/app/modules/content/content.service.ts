import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TContent } from "./content.interface";
import { Content } from "./content.model";

const createContentIntoDB = async (payload: TContent) => {
  const userExist = await User.findById(payload.user);
  if (!userExist) {
    throw new AppError(httpStatus.NOT_FOUND, "This user not found");
  }

  const content = await Content.create(payload);

  // populate user
  const populateContent = await content.populate("user");
  return populateContent;
};

const getAllContentFromDB = async () => {
  const result = await Content.find().populate("user");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found!");
  }

  return result;
};

const getMyContentsFromDB = async (email: string) => {
  const result = await Content.find().populate({
    path: "user",
    match: { email: email }, // Filters based on email during population
  });

  if (!result || result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found!");
  }

  return result.filter((content) => content.user !== null); // Ensures only content with matched users is returned
};

export { createContentIntoDB, getAllContentFromDB, getMyContentsFromDB };
