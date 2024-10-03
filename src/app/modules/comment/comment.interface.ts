import { Types } from "mongoose";

export type TComment = {
  user: Types.ObjectId;
  content: Types.ObjectId;
  comment: string;
};
