"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCommentIntoDB = exports.deleteCommentIntoDB = exports.getCommentsFromDB = exports.createCommentIntoDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const content_model_1 = require("../content/content.model");
const comment_model_1 = require("./comment.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createCommentIntoDB = (commentData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_model_1.Comment.create(commentData);
    return result;
});
exports.createCommentIntoDB = createCommentIntoDB;
const getCommentsFromDB = (contentId) => __awaiter(void 0, void 0, void 0, function* () {
    const contentExist = yield content_model_1.Content.findById(contentId);
    if (!contentExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Content not found!😥😥");
    }
    const result = yield comment_model_1.Comment.find({ content: contentId }).populate("user");
    return result;
});
exports.getCommentsFromDB = getCommentsFromDB;
const deleteCommentIntoDB = (commentId) => __awaiter(void 0, void 0, void 0, function* () {
    const commentExist = yield comment_model_1.Comment.findById(commentId);
    if (!commentExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Comment not found!😥😥");
    }
    const result = yield comment_model_1.Comment.findByIdAndDelete(commentId);
    return result;
});
exports.deleteCommentIntoDB = deleteCommentIntoDB;
const updateCommentIntoDB = (commentId, updateComment) => __awaiter(void 0, void 0, void 0, function* () {
    if (!mongoose_1.default.Types.ObjectId.isValid(commentId)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid Comment ID! 😥😥");
    }
    const commentExist = yield comment_model_1.Comment.findById(commentId);
    if (!commentExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Comment not found! 😥😥");
    }
    const { comment } = updateComment;
    if (typeof comment !== "string") {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Comment must be a string! 😥😥");
    }
    const result = yield comment_model_1.Comment.findByIdAndUpdate(commentId, { comment }, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.updateCommentIntoDB = updateCommentIntoDB;
