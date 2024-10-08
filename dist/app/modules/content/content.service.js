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
exports.upvoteContentIntoDB = exports.updateStatusFromDB = exports.getMyContentsFromDB = exports.getAllContentFromDB = exports.downvoteContentIntoDB = exports.createContentIntoDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
// import { QueryBuilder } from "../../builder/QueryBuilder";
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const content_model_1 = require("./content.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createContentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userExist = yield user_model_1.User.findById(payload.user);
    if (!userExist) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user not found");
    }
    const content = yield content_model_1.Content.create(payload);
    // populate user
    const populateContent = yield content.populate("user");
    return populateContent;
});
exports.createContentIntoDB = createContentIntoDB;
const getAllContentFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const itemQuery = new QueryBuilder_1.default(content_model_1.Content.find().populate("user"), query)
        .search(["content"])
        .filter()
        .sort()
        .paginate()
        .fields();
    const contents = yield itemQuery.modelQuery;
    const meta = yield itemQuery.countTotal();
    if (!contents) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Content not found!");
    }
    // Convert each result to an object to include virtuals like totalVote
    const result = contents.map((content) => content.toObject());
    return { result, meta };
});
exports.getAllContentFromDB = getAllContentFromDB;
const getMyContentsFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield content_model_1.Content.find()
        .populate({
        path: "user",
        match: { email: email },
    })
        .sort({ createdAt: -1 });
    if (!result || result.length === 0) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Content not found!");
    }
    // Filter contents with matched users and include virtuals like totalVote
    const filteredContents = result
        .filter((content) => content.user !== null)
        .map((content) => content.toObject());
    return filteredContents;
});
exports.getMyContentsFromDB = getMyContentsFromDB;
const upvoteContentIntoDB = (contentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the content and update it using $addToSet for upVote and $pull for downVote
    const content = yield content_model_1.Content.findByIdAndUpdate(contentId, {
        $addToSet: { upVote: userId },
        $pull: { downVote: userId },
    }, { new: true });
    if (!content) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Content not found!");
    }
    return content;
});
exports.upvoteContentIntoDB = upvoteContentIntoDB;
const downvoteContentIntoDB = (contentId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the content and update it using $addToSet for downVote and $pull for upVote
    const content = yield content_model_1.Content.findByIdAndUpdate(contentId, {
        $addToSet: { downVote: userId },
        $pull: { upVote: userId },
    }, { new: true });
    if (!content) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Content not found!");
    }
    return content;
});
exports.downvoteContentIntoDB = downvoteContentIntoDB;
const updateStatusFromDB = (contentId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const content = yield content_model_1.Content.findById(contentId);
    if (!content) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Content not found!");
    }
    // Validate content update
    const validStatus = ["PUBLISH", "UNPUBLISH"];
    if (!validStatus.includes(status)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Invalid status: ${status}`);
    }
    const result = yield content_model_1.Content.findByIdAndUpdate(contentId, { status: status }, { new: true });
    return result;
});
exports.updateStatusFromDB = updateStatusFromDB;
