/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, Types } from "mongoose";
import { USER_ROLE } from "./user.constant";

export type TRole = "USER" | "ADMIN";

export type TUser = {
  _id: any;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  image: string;
  status: "BASIC" | "PREMIUM";
  isBlock: boolean;
  isDeleted: boolean;
  role: TRole;
  flowers: Types.ObjectId[];
  flowing: Types.ObjectId[];
};

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
