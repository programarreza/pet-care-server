import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import {
  createPaymentIntoDB,
  paymentConfirmationIntoDB,
} from "./payment.service";

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

  const result = await paymentConfirmationIntoDB(
    transactionId as string,
    status as string
  );

  if (result?.paymentStatus === "PAID") {
    const paymentUrl = `${config.client_url}/payment-successful?transactionId=${transactionId}&amount=${result?.paymentAmount}&status=${status}&date=${new Date().toISOString()}`;

    return res.redirect(paymentUrl);
  } else {
    const paymentUrl = `${config.client_url}/payment-failed?status=${status}`;

    return res.redirect(paymentUrl);
  }

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment successful. Rental updated.",
    data: result,
  });
});

export { createPayment, paymentConfirmation };
