"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, { timestamps: true });
exports.Payment = (0, mongoose_1.model)("Payment", paymentSchema);
