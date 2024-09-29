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
exports.deleteUserFromDB = exports.updateUserFromDB = exports.getAllUserFromDB = exports.updateUserProfileFromDB = exports.getUserProfileFromDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("./user.model");
const getUserProfileFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ email: email });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found !");
    }
    return result;
});
exports.getUserProfileFromDB = getUserProfileFromDB;
const getAllUserFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find();
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found !");
    }
    return result;
});
exports.getAllUserFromDB = getAllUserFromDB;
const updateUserProfileFromDB = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user is exist by email
    const user = yield user_model_1.User.isUserExistsByEmail(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found !");
    }
    //   checking if the email is not updated
    if (payload === null || payload === void 0 ? void 0 : payload.email) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Your email address is not changing");
    }
    // find user and profile update
    const result = yield user_model_1.User.findOneAndUpdate({ email }, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Failed to update user profile");
    }
    return result;
});
exports.updateUserProfileFromDB = updateUserProfileFromDB;
const updateUserFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found !");
    }
    //   checking if the email is not updated
    if (payload === null || payload === void 0 ? void 0 : payload.email) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Your email address is not changing");
    }
    // find user and profile update
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Failed to update user ");
    }
    return result;
});
exports.updateUserFromDB = updateUserFromDB;
const deleteUserFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found !");
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { isDeleted: true }, {
        new: true,
        runValidators: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Failed to delete user ");
    }
    return result;
});
exports.deleteUserFromDB = deleteUserFromDB;
