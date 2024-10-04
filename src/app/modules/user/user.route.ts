import { Router } from "express";
import auth from "../../middleware/auth";
import validateRequest from "../../middleware/validateRequest";
import { USER_ROLE } from "./user.constant";
import {
  deleteUser,
  followUser,
  getAllUser,
  getUserProfile,
  unFollowUser,
  updateBlockStatus,
  updateUser,
  updateUserProfile,
  updateUserRole,
  updateUserStatus,
} from "./user.controller";
import { updateUserValidationSchema } from "./user.validation";

const userRoutes = Router();

userRoutes.get(
  "/me",
  // auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  getUserProfile
);
userRoutes.get(
  "/",
  // auth(USER_ROLE.ADMIN),
  getAllUser
);

userRoutes.put(
  "/me",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  validateRequest(updateUserValidationSchema),
  updateUserProfile
);

userRoutes.patch(
  "/:id",
  // auth(USER_ROLE.ADMIN),
  validateRequest(updateUserValidationSchema),
  updateUser
);

userRoutes.delete("/:id", auth(USER_ROLE.ADMIN), deleteUser);

userRoutes.post(
  "/follow",
  // auth(USER_ROLE.USER),
  followUser
);

userRoutes.post(
  "/un-follow",
  // auth(USER_ROLE.USER),
  unFollowUser
);

userRoutes.patch(
  "/block-status/:id",
  // auth(USER_ROLE.ADMIN),
  updateBlockStatus
);

userRoutes.patch(
  "/status/:id",
  // auth(USER_ROLE.ADMIN),
  updateUserStatus
);

userRoutes.patch(
  "/change-role/:id",
  // auth(USER_ROLE.ADMIN),
  updateUserRole
);

export default userRoutes;
