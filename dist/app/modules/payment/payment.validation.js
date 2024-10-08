"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentValidationSchema = void 0;
const zod_1 = require("zod");
const paymentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.string({ invalid_type_error: "User ID is required" }),
    }),
});
exports.paymentValidationSchema = paymentValidationSchema;
