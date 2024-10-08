"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoute = void 0;
const express_1 = require("express");
const payment_controller_1 = require("./payment.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const payment_validation_1 = require("./payment.validation");
const paymentRoute = (0, express_1.Router)();
exports.paymentRoute = paymentRoute;
paymentRoute.post("/create-payment", (0, validateRequest_1.default)(payment_validation_1.paymentValidationSchema), payment_controller_1.createPayment);
paymentRoute.post("/confirmation", payment_controller_1.paymentConfirmation);
paymentRoute.get("/", payment_controller_1.getPayments);
