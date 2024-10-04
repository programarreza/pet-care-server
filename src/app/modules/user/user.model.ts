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

// Middleware to ensure deleted users are excluded
function checkAccessForDeletedUsers(this: any, next: any) {
  // Ensure deleted users are excluded
  this.find({ isDeleted: { $ne: true } });
  next();
}

userSchema.pre("find", checkAccessForDeletedUsers);
userSchema.pre("findOne", checkAccessForDeletedUsers);
userSchema.pre("aggregate", function (next) {
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

// Set '' after saving password
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
