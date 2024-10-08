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
exports.User = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const user_constant_1 = require("./user.constant");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        select: 0,
    },
    phone: {
        type: String,
        required: [true, "phone number is required"],
    },
    address: {
        type: String,
        required: [true, "address is required"],
    },
    role: {
        type: String,
        default: user_constant_1.USER_ROLE.USER,
        enum: [user_constant_1.USER_ROLE.USER, user_constant_1.USER_ROLE.ADMIN],
    },
    image: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        default: "BASIC",
        enum: ["BASIC", "PREMIUM"],
    },
    followers: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    following: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            default: [],
        },
    ],
    isBlock: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
// Middleware to ensure deleted users are excluded
function checkAccessForDeletedUsers(next) {
    // Ensure deleted users are excluded
    this.find({ isDeleted: { $ne: true } });
    next();
}
userSchema.pre("find", checkAccessForDeletedUsers);
userSchema.pre("findOne", checkAccessForDeletedUsers);
userSchema.pre("aggregate", function (next) {
    // Exclude deleted users in aggregation
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        // Only hash the password if it has been modified (or is new)
        if (!user.isModified("password")) {
            return next();
        }
        if (!user.password) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Password is required");
        }
        try {
            // Hashing password before saving it into the DB
            const saltRounds = Number(config_1.default.bcrypt_salt_rounds);
            if (!saltRounds) {
                throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Invalid salt rounds");
            }
            user.password = yield bcrypt_1.default.hash(user.password, saltRounds);
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
// Set '' after saving password
userSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});
userSchema.statics.isUserExistsByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email }).select("+password");
    });
};
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
exports.User = (0, mongoose_1.model)("User", userSchema);
