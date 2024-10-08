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
exports.updateUserRoleFromDB = exports.updateUserStatusFromDB = exports.updateBlockStatusIntoDB = exports.unfollowUserFromDB = exports.createFollowingIntoDB = exports.deleteUserFromDB = exports.updateUserFromDB = exports.getAllUserFromDB = exports.updateUserProfileFromDB = exports.getUserProfileFromDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("./user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const user_constant_1 = require("./user.constant");
const getUserProfileFromDB = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ email: email })
        .populate("following")
        .populate("followers");
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
const createFollowingIntoDB = (userId, followingId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        const followingObjectId = new mongoose_1.default.Types.ObjectId(followingId);
        const currentUser = yield user_model_1.User.findById(userObjectId).session(session);
        const userToFollow = yield user_model_1.User.findById(followingObjectId).session(session);
        if (!currentUser || !userToFollow) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        if (currentUser.following.includes(followingObjectId)) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, "Already following this user");
        }
        // Add following and follower
        currentUser.following.push(followingObjectId);
        userToFollow.followers.push(userObjectId);
        // Save both users within the session
        yield currentUser.save({ session });
        yield userToFollow.save({ session });
        yield session.commitTransaction();
        session.endSession();
        const updatedUser = yield user_model_1.User.findById(userObjectId)
            .populate("following")
            .populate("followers")
            .lean();
        return updatedUser;
    }
    catch (error) {
        // Rollback the transaction in case of an error
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.createFollowingIntoDB = createFollowingIntoDB;
const unfollowUserFromDB = (userId, followingId) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        const followingObjectId = new mongoose_1.default.Types.ObjectId(followingId);
        // Find the current user and the user to unfollow
        const currentUser = yield user_model_1.User.findById(userObjectId).session(session);
        const userToUnfollow = yield user_model_1.User.findById(followingObjectId).session(session);
        if (!currentUser || !userToUnfollow) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
        }
        if (!currentUser.following.includes(followingObjectId)) {
            throw new AppError_1.default(http_status_1.default.CONFLICT, "You are not following this user");
        }
        // Remove the following relationship
        currentUser.following = currentUser.following.filter((id) => !id.equals(followingObjectId));
        userToUnfollow.followers = userToUnfollow.followers.filter((id) => !id.equals(userObjectId));
        // Save both users
        yield currentUser.save({ session });
        yield userToUnfollow.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return currentUser;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
exports.unfollowUserFromDB = unfollowUserFromDB;
const updateBlockStatusIntoDB = (id, isBlock) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { isBlock: isBlock }, { new: true });
    return result;
});
exports.updateBlockStatusIntoDB = updateBlockStatusIntoDB;
const updateUserStatusFromDB = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Validate status update
    const validStatuses = ["BASIC", "PREMIUM"];
    if (!validStatuses.includes(status)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Invalid status: ${status}`);
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { status: status }, { new: true });
    return result;
});
exports.updateUserStatusFromDB = updateUserStatusFromDB;
const updateUserRoleFromDB = (id, role) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Validate role update
    const validRoles = [user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN];
    if (!validRoles.includes(role)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `Invalid role: ${role}`);
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, { role: role }, { new: true });
    return result;
});
exports.updateUserRoleFromDB = updateUserRoleFromDB;
