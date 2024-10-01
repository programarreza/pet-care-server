/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from "bcrypt";
import { Schema, Types, model } from "mongoose";
import config from "../../config";
import { TUser, UserModel } from "./user.interface";
import { USER_ROLE } from "./user.constant";

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
    flowers: [
      {
        type: Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    flowing: [
      {
        type: Types.ObjectId,
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

userSchema.pre("save", async function (next) {
  const user = this;

  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

// set '' ofter saving password
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

userSchema.pre("find", async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre("findOne", async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const User = model<TUser, UserModel>("User", userSchema);
