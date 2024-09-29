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
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_utils_1 = require("../../utils/auth.utils");
const user_model_1 = require("../user/user.model");
const auth_utils_2 = require("./auth.utils");
const signup = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // create a user
    const user = yield user_model_1.User.isUserExistsByEmail(payload === null || payload === void 0 ? void 0 : payload.email);
    if (user) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "This user already exists");
    }
    const newUser = yield user_model_1.User.create(payload);
    return newUser;
});
const login = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExistsByEmail(payload === null || payload === void 0 ? void 0 : payload.email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "user is not found!");
    }
    // checking  password
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Password do not matched!!");
    }
    const jwtPayload = {
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user === null || user === void 0 ? void 0 : user.email,
        phone: user === null || user === void 0 ? void 0 : user.phone,
        image: user === null || user === void 0 ? void 0 : user.image,
        isActive: user === null || user === void 0 ? void 0 : user.isActive,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    // create access token & send
    const accessToken = (0, auth_utils_2.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    // create refresh token
    const refreshToken = (0, auth_utils_2.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    // Create a new object without including the password field
    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
    };
    return {
        accessToken,
        refreshToken,
        user: userData,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { email } = decoded;
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExistsByEmail(email);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "This user is not found!");
    }
    const jwtPayload = {
        name: user === null || user === void 0 ? void 0 : user.name,
        email: user === null || user === void 0 ? void 0 : user.email,
        phone: user === null || user === void 0 ? void 0 : user.phone,
        image: user === null || user === void 0 ? void 0 : user.image,
        isActive: user === null || user === void 0 ? void 0 : user.isActive,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    // create token and send to the client
    const accessToken = (0, auth_utils_2.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        accessToken,
    };
});
exports.AuthServices = {
    signup,
    login,
    refreshToken,
};
