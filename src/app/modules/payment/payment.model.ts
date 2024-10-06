import { model, Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    paymentAmount: {
      type: Number,
      default: 100,
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Payment = model("Payment", paymentSchema);
