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
exports.getPayments = exports.paymentConfirmation = exports.createPayment = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const payment_service_1 = require("./payment.service");
const createPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, payment_service_1.createPaymentIntoDB)(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment create successfully",
        data: result,
    });
}));
exports.createPayment = createPayment;
const paymentConfirmation = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId, status } = req.query;
    const result = yield (0, payment_service_1.paymentConfirmationIntoDB)(transactionId, status);
    if ((result === null || result === void 0 ? void 0 : result.paymentStatus) === "PAID") {
        const paymentUrl = `${config_1.default.client_url}/payment-successful?transactionId=${transactionId}&amount=${result === null || result === void 0 ? void 0 : result.paymentAmount}&status=${status}&date=${new Date().toISOString()}`;
        return res.redirect(paymentUrl);
    }
    else {
        const paymentUrl = `${config_1.default.client_url}/payment-failed?status=${status}`;
        return res.redirect(paymentUrl);
    }
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Payment successful. Rental updated.",
        data: result,
    });
}));
exports.paymentConfirmation = paymentConfirmation;
const getPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, payment_service_1.getPaymentsFromDB)();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Payment is retrieved successfully",
        data: result,
    });
}));
exports.getPayments = getPayments;
