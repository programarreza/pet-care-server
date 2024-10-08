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
exports.updateStatus = exports.downvoteContent = exports.upvoteContent = exports.getMyContents = exports.getAllContent = exports.createContent = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const content_service_1 = require("./content.service");
const createContent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield (0, content_service_1.createContentIntoDB)(Object.assign(Object.assign({}, req.body), { image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.path }));
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Content post successfully",
        data: result,
    });
}));
exports.createContent = createContent;
const getAllContent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, content_service_1.getAllContentFromDB)(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Contents is retrieved successfully",
        data: result,
    });
}));
exports.getAllContent = getAllContent;
const getMyContents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.query;
    const result = yield (0, content_service_1.getMyContentsFromDB)(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "My Contents is retrieved successfully",
        data: result,
    });
}));
exports.getMyContents = getMyContents;
const upvoteContent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contentId } = req.params;
    const { userId } = req.body;
    const result = yield (0, content_service_1.upvoteContentIntoDB)(contentId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Upvote successfully!",
        data: result,
    });
}));
exports.upvoteContent = upvoteContent;
const downvoteContent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contentId } = req.params;
    const { userId } = req.body;
    const result = yield (0, content_service_1.downvoteContentIntoDB)(contentId, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Downvote successfully!",
        data: result,
    });
}));
exports.downvoteContent = downvoteContent;
const updateStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contentId } = req.params;
    const { status } = req.body;
    const result = yield (0, content_service_1.updateStatusFromDB)(contentId, status);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Status change successfully!",
        data: result,
    });
}));
exports.updateStatus = updateStatus;
