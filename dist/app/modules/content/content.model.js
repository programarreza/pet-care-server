"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = void 0;
const mongoose_1 = require("mongoose");
const user_constant_1 = require("../user/user.constant");
const contentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: null,
    },
    category: {
        type: String,
        enum: ["STORY", "TIP"],
        required: true,
    },
    contentType: {
        type: String,
        enum: ["BASIC", "PREMIUM"],
        require: true,
    },
    upVote: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    downVote: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    status: {
        type: String,
        enum: ["PUBLISH", "UNPUBLISH"],
        default: "PUBLISH",
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });
// Adding the virtual field for totalVote
contentSchema.virtual("totalVote").get(function () {
    const upVotesCount = this.upVote.length;
    const downVotesCount = this.downVote.length;
    // Each upvote is counted as +1 and each downvote as -1
    return upVotesCount - downVotesCount;
});
// Middleware to restrict access for non-admins
function checkAccessRestrictions(next) {
    // const user = {
    //   role: "USER",
    // };
    // const currentUser = this.getOptions().user ; 
    // Non-admins can't access UNPUBLISH content or blocked/deleted users' content
    // if (currentUser?.role !== USER_ROLE.ADMIN) {
    //   this.find({ status: "PUBLISH", isDeleted: { $ne: true } });
    // }
    // Ensure deleted content is always excluded for all users
    this.find({ isDeleted: { $ne: true } });
    next();
}
// Applying the middleware for find, findOne, and aggregation operations
contentSchema.pre("find", checkAccessRestrictions);
contentSchema.pre("findOne", checkAccessRestrictions);
contentSchema.pre("aggregate", function (next) {
    const currentUser = this.options.user; // Assuming user context is passed in options
    // Non-admins can't access UNPUBLISH content or blocked/deleted users' content
    if ((currentUser === null || currentUser === void 0 ? void 0 : currentUser.role) !== user_constant_1.USER_ROLE.ADMIN) {
        this.pipeline().unshift({
            $match: { status: "PUBLISH", isDeleted: { $ne: true } },
        });
    }
    // Exclude deleted content for all users
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
exports.Content = (0, mongoose_1.model)("Content", contentSchema);
