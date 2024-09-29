import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import config from "../config";
import AppError from "../errors/AppError";

// Global Error Handler Middleware
const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorMessages: { path: string; message: string }[] = [
    { path: "", message: "Something went wrong" },
  ];

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";
    errorMessages = err.errors.map((error) => ({
      path: error.path.join("."),
      message: error.message,
    }));
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = "Cast Error";
    errorMessages = [{ path: "", message: err.message }];
  } else if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate Entry Error";
    errorMessages = [{ path: "", message: err.message }];
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorMessages = [{ path: "", message: err.message }];
  } else if (err instanceof Error) {
    message = err.message;
    errorMessages = [{ path: "", message: err.message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.NODE_ENV === "development" ? err.stack : null,
  });

  next();
};

export default globalErrorHandler;
