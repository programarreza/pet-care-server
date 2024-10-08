"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_constant_1 = require("./user.constant");
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const userRoutes = (0, express_1.Router)();
userRoutes.get("/me", 
// auth(USER_ROLE.USER, USER_ROLE.ADMIN),
user_controller_1.getUserProfile);
userRoutes.get("/", 
// auth(USER_ROLE.ADMIN),
user_controller_1.getAllUser);
userRoutes.put("/me", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), (0, validateRequest_1.default)(user_validation_1.updateUserValidationSchema), user_controller_1.updateUserProfile);
userRoutes.patch("/:id", 
// auth(USER_ROLE.ADMIN),
(0, validateRequest_1.default)(user_validation_1.updateUserValidationSchema), user_controller_1.updateUser);
userRoutes.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), user_controller_1.deleteUser);
userRoutes.post("/follow", 
// auth(USER_ROLE.USER),
user_controller_1.followUser);
userRoutes.post("/un-follow", 
// auth(USER_ROLE.USER),
user_controller_1.unFollowUser);
userRoutes.patch("/block-status/:id", 
// auth(USER_ROLE.ADMIN),
user_controller_1.updateBlockStatus);
userRoutes.patch("/status/:id", 
// auth(USER_ROLE.ADMIN),
user_controller_1.updateUserStatus);
userRoutes.patch("/change-role/:id", 
// auth(USER_ROLE.ADMIN),
user_controller_1.updateUserRole);
exports.default = userRoutes;
