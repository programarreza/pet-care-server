import { Schema, Types, model } from "mongoose";
import { TContent } from "./content.interface";
import { USER_ROLE } from "../user/user.constant";

const contentSchema = new Schema<TContent>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      enum: ["STORY", "TIP"],
      required: true,
    },
    contentType: {
      type: String,
      enum: ["BASIC", "PREMIUM"],
      require: true,
    },
    upVote: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    downVote: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    status: {
      type: String,
      enum: ["PUBLISH", "UNPUBLISH"],
      default: "PUBLISH",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

// Adding the virtual field for totalVote
contentSchema.virtual("totalVote").get(function () {
  const upVotesCount = this.upVote.length;
  const downVotesCount = this.downVote.length;
  // Each upvote is counted as +1 and each downvote as -1
  return upVotesCount - downVotesCount;
});

// Middleware to restrict access for non-admins
function checkAccessRestrictions(this: any, next: any) {
  // const user = {
  //   role: "USER",
  // };
  // const currentUser = this.getOptions().user ; 

  // Non-admins can't access UNPUBLISH content or blocked/deleted users' content
  // if (currentUser?.role !== USER_ROLE.ADMIN) {
  //   this.find({ status: "PUBLISH", isDeleted: { $ne: true } });
  // }

  // Ensure deleted content is always excluded for all users
  this.find({ isDeleted: { $ne: true } });

  next();
}

// Applying the middleware for find, findOne, and aggregation operations
contentSchema.pre("find", checkAccessRestrictions);
contentSchema.pre("findOne", checkAccessRestrictions);
contentSchema.pre("aggregate", function (next) {
  const currentUser = this.options.user; // Assuming user context is passed in options

  // Non-admins can't access UNPUBLISH content or blocked/deleted users' content
  if (currentUser?.role !== USER_ROLE.ADMIN) {
    this.pipeline().unshift({
      $match: { status: "PUBLISH", isDeleted: { $ne: true } },
    });
  }

  // Exclude deleted content for all users
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });

  next();
});

export const Content = model<TContent>("Content", contentSchema);
