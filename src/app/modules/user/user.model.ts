/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from "bcrypt";
import { Schema, Types, model } from "mongoose";
import config from "../../config";
import { TUser, UserModel } from "./user.interface";
import { USER_ROLE } from "./user.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      select: 0,
    },
    phone: {
      type: String,
      required: [true, "phone number is required"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    role: {
      type: String,
      default: USER_ROLE.USER,
      enum: [USER_ROLE.USER, USER_ROLE.ADMIN],
    },
    image: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      default: "BASIC",
      enum: ["BASIC", "PREMIUM"],
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    isBlock: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Middleware to check access to blocked users
function checkAccessForBlockedUsers(this: any, next: any) {
  // Check if the user querying is an admin
  const currentUser = this.getOptions().user; // Assuming user context is passed in options
  if (currentUser?.role !== USER_ROLE.ADMIN) {
    this.find({ isBlock: { $ne: true } }); // Non-admins cannot access blocked users
  }

  // Ensure deleted users are also excluded
  this.find({ isDeleted: { $ne: true } });
  next();
}

userSchema.pre("find", checkAccessForBlockedUsers);
userSchema.pre("findOne", checkAccessForBlockedUsers);
userSchema.pre("aggregate", function (next) {
  const currentUser = this.options.user; // Assuming user context is passed in options

  if (currentUser?.role !== USER_ROLE.ADMIN) {
    // Add match condition for non-admins to exclude blocked users
    this.pipeline().unshift({ $match: { isBlock: { $ne: true } } });
  }

  // Exclude deleted users in aggregation
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });

  next();
});

userSchema.pre("save", async function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) {
    return next();
  }

  if (!user.password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Password is required");
  }

  try {
    // Hashing password before saving it into the DB
    const saltRounds = Number(config.bcrypt_salt_rounds);
    if (!saltRounds) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Invalid salt rounds"
      );
    }

    user.password = await bcrypt.hash(user.password, saltRounds);
    next();
  } catch (error: any) {
    next(error);
  }
});

// set '' after saving password
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select("+password");
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>("User", userSchema);
