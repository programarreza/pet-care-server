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

export { createContentIntoDB };
