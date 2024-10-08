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
exports.getPaymentsFromDB = exports.paymentConfirmationIntoDB = exports.createPaymentIntoDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const payment_model_1 = require("./payment.model");
const payment_utils_1 = require("./payment.utils");
const createPaymentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = (0, uuid_1.v4)();
    const { user: userId } = payload;
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found 😥😥");
    }
    const paymentData = {
        transactionId,
        totalPrice: 100,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        customerAddress: user.address,
    };
    const orderData = {
        user: userId,
        transactionId,
    };
    yield payment_model_1.Payment.create(orderData);
    // payment creation
    const paymentSession = yield (0, payment_utils_1.initiatePayment)(paymentData);
    return paymentSession;
});
exports.createPaymentIntoDB = createPaymentIntoDB;
const paymentConfirmationIntoDB = (transactionId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        // verify payment
        const verifyPaymentResponse = yield (0, payment_utils_1.verifyPayment)(transactionId);
        let payment;
        let message;
        if (verifyPaymentResponse &&
            verifyPaymentResponse.pay_status === "Successful") {
            // Update payment status to "PAID"
            payment = yield payment_model_1.Payment.findOneAndUpdate({ transactionId }, { paymentStatus: "PAID" }, { session, new: true });
            if (!payment) {
                throw new Error("Payment not found");
            }
            // Update user status to "PREMIUM"
            const user = yield user_model_1.User.findByIdAndUpdate(payment.user, { status: "PREMIUM" }, { session, new: true });
            if (!user) {
                throw new Error("User not found");
            }
            // Commit the transaction
            yield session.commitTransaction();
            session.endSession();
            message = "Payment Paid!";
        }
        else {
            message = "Payment Failed!";
        }
        //! use html template
        // const filePath = join(__dirname, "../../../views/confirmation.html");
        // let template = readFileSync(filePath, "utf-8");
        // template = template.replace("{{message}}", message);
        // console.log({ template });
        return payment;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error("Transaction error:", error);
        throw error;
    }
});
exports.paymentConfirmationIntoDB = paymentConfirmationIntoDB;
const getPaymentsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_model_1.Payment.find().populate("user");
    return result;
});
exports.getPaymentsFromDB = getPaymentsFromDB;
