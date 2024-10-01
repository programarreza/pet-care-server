import { Types } from "mongoose";

export type TCategory = "STORY" | "TIP";
export type TContentType = "BASIC" | "PREMIUM";
export type TStatus = "PUBLISH" | "UNPUBLISH";

export type TContent = {
  user: Types.ObjectId;
  content: string;
  image: string | null;
  category: TCategory;
  contentType: TContentType;
  upVote: Types.ObjectId[];
  downVote: Types.ObjectId[];
  status: TStatus;
  isDeleted: boolean;
};
