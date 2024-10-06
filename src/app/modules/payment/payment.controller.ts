import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  createPaymentIntoDB,
  paymentConfirmationIntoDB,
} from "./payment.service";
import { Request } from "express";

const createPayment = catchAsync(async (req, res) => {
  const result = await createPaymentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment create successfully",
    data: result,
  });
});

const paymentConfirmation = catchAsync(async (req, res) => {
  const { transactionId, status } = req.query;

  console.log(19, req.query);

  const result = await paymentConfirmationIntoDB(
    transactionId as string,
    status as string
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment confirmation",
    data: `payment successfully!!`,
  });
});

export { createPayment, paymentConfirmation };
