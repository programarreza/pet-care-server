"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_config_1 = require("../../config/multer.config");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const content_controller_1 = require("./content.controller");
const content_validation_1 = require("./content.validation");
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middleware/auth"));
const contentRoutes = (0, express_1.Router)();
contentRoutes.post("/create-content", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.USER), multer_config_1.multerUpload.single("image"), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(content_validation_1.createContentValidationSchema), content_controller_1.createContent);
contentRoutes.get("/", content_controller_1.getAllContent);
contentRoutes.get("/my-contents", (0, auth_1.default)(user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN), content_controller_1.getMyContents);
contentRoutes.patch("/upvote/:contentId", 
// auth(USER_ROLE.USER, USER_ROLE.ADMIN),
content_controller_1.upvoteContent);
contentRoutes.patch("/downvote/:contentId", 
// auth(USER_ROLE.USER, USER_ROLE.ADMIN),
content_controller_1.downvoteContent);
contentRoutes.patch("/change-status/:contentId", 
// auth(USER_ROLE.USER, USER_ROLE.ADMIN),
content_controller_1.updateStatus);
exports.default = contentRoutes;
