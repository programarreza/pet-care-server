import httpStatus from "http-status";
import { QueryBuilder } from "../../builder/QueryBuilder";
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

const getAllContentFromDB = async (query: Record<string, unknown>) => {
  const itemQuery = new QueryBuilder(Content.find().populate("user"), query)
    .search(["content"])
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

const updateStatusFromDB = async (contentId: string, status: string) => {
  const content = await Content.findById(contentId);
  if (!content) {
    throw new AppError(httpStatus.NOT_FOUND, "Content not found!");
  }

  // Validate content update
  const validStatus = ["PUBLISH", "UNPUBLISH"];
  if (!validStatus.includes(status)) {
    throw new AppError(httpStatus.BAD_REQUEST, `Invalid status: ${status}`);
  }

  const result = await Content.findByIdAndUpdate(
    contentId,
    { status: status },
    { new: true }
  );
  return result;
};

export {
  createContentIntoDB,
  downvoteContentIntoDB,
  getAllContentFromDB,
  getMyContentsFromDB,
  updateStatusFromDB,
  upvoteContentIntoDB,
};
