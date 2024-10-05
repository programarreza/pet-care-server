import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { TContent } from "./content.interface";
import { Content } from "./content.model";
import { QueryBuilder } from "../../builder/QueryBuilder";

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

const getAllContentFromDB = async (query: Record<string, unknown>) => {
  const itemQuery = new QueryBuilder(Content.find().populate("user"), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await itemQuery.modelQuery;

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found!");
  }

  // Convert each result to an object to include virtuals like totalVote
  const contentWithVirtuals = result.map((content) => content.toObject());

  return contentWithVirtuals;
};

const getMyContentsFromDB = async (email: string) => {
  const result = await Content.find()
    .populate({
      path: "user",
      match: { email: email }, 
    })
    .sort({ createdAt: -1 });

  if (!result || result.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found!");
  }

  // Filter contents with matched users and include virtuals like totalVote
  const filteredContents = result
    .filter((content) => content.user !== null) 
    .map((content) => content.toObject()); 

  return filteredContents;
};

const upvoteContentIntoDB = async (contentId: string, userId: string) => {
  // Find the content and update it using $addToSet for upVote and $pull for downVote
  const content = await Content.findByIdAndUpdate(
    contentId,
    {
      $addToSet: { upVote: userId }, 
      $pull: { downVote: userId }, 
    },
    { new: true }
  );

  if (!content) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found!");
  }

  return content;
};

const downvoteContentIntoDB = async (contentId: string, userId: string) => {
  // Find the content and update it using $addToSet for downVote and $pull for upVote
  const content = await Content.findByIdAndUpdate(
    contentId,
    {
      $addToSet: { downVote: userId },
      $pull: { upVote: userId }, 
    },
    { new: true }
  );

  if (!content) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found!");
  }

  return content;
};

export {
  createContentIntoDB,
  getAllContentFromDB,
  getMyContentsFromDB,
  upvoteContentIntoDB,
  downvoteContentIntoDB,
};
