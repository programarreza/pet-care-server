import { Router } from "express";
import {
  createPayment,
  getPayments,
  paymentConfirmation,
} from "./payment.controller";
import validateRequest from "../../middleware/validateRequest";
import { paymentValidationSchema } from "./payment.validation";

const paymentRoute = Router();

paymentRoute.post(
  "/create-payment",
  validateRequest(paymentValidationSchema),
  createPayment
);

paymentRoute.post("/confirmation", paymentConfirmation);
paymentRoute.get("/", getPayments);

export { paymentRoute };
