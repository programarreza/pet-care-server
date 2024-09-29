"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../errors/AppError"));
// Global Error Handler Middleware
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong";
    let errorMessages = [
        { path: "", message: "Something went wrong" },
    ];
    if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = "Validation Error";
        errorMessages = err.errors.map((error) => ({
            path: error.path.join("."),
            message: error.message,
        }));
    }
    else if (err.name === "CastError") {
        statusCode = 400;
        message = "Cast Error";
        errorMessages = [{ path: "", message: err.message }];
    }
    else if (err.code === 11000) {
        statusCode = 400;
        message = "Duplicate Entry Error";
        errorMessages = [{ path: "", message: err.message }];
    }
    else if (err instanceof AppError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorMessages = [{ path: "", message: err.message }];
    }
    else if (err instanceof Error) {
        message = err.message;
        errorMessages = [{ path: "", message: err.message }];
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorMessages,
        stack: config_1.default.NODE_ENV === "development" ? err.stack : null,
    });
    next();
};
exports.default = globalErrorHandler;
