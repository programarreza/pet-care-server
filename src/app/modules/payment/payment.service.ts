import httpStatus from "http-status";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import AppError from "../../errors/AppError";
import { User } from "../user/user.model";
import { Payment } from "./payment.model";
import { initiatePayment, verifyPayment } from "./payment.utils";

const createPaymentIntoDB = async (payload: Record<string, unknown>) => {
  const transactionId = uuidv4();
  const { user: userId } = payload;

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found 😥😥");
  }

  const paymentData = {
    transactionId,
    totalPrice: 100,
    customerName: user.name,
    customerEmail: user.email,
    customerPhone: user.phone,
    customerAddress: user.address,
  };
  console.log(paymentData);

  const orderData = {
    user: userId,
    transactionId,
  };

  await Payment.create(orderData);

  // payment creation
  const paymentSession = await initiatePayment(paymentData);

  return paymentSession;
};

const paymentConfirmationIntoDB = async (
  transactionId: string,
  status: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // verify payment
    const verifyPaymentResponse = await verifyPayment(transactionId);
    console.log(verifyPaymentResponse);

    let payment;

    if (
      verifyPaymentResponse &&
      verifyPaymentResponse.pay_status === "Successful"
    ) {
      // Update payment status to "PAID"
      payment = await Payment.findOneAndUpdate(
        { transactionId },
        { paymentStatus: "PAID" },
        { session, new: true }
      );

      if (!payment) {
        throw new Error("Payment not found");
      }

      // Update user status to "PREMIUM"
      const user = await User.findByIdAndUpdate(
        payment.user,
        { status: "PREMIUM" },
        { session, new: true }
      );

      if (!user) {
        throw new Error("User not found");
      }

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();
    }

    return payment;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction error:", error);
    throw error;
  }
};

export { createPaymentIntoDB, paymentConfirmationIntoDB };
