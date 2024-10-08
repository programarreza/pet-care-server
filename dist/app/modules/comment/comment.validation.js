"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidationSchema = void 0;
const zod_1 = require("zod");
exports.CommentValidationSchema = zod_1.z.object({
    user: zod_1.z
        .string()
        .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
        message: "Invalid ObjectId format for user",
    })
        .optional(),
    content: zod_1.z
        .string()
        .refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
        message: "Invalid ObjectId format for content",
    })
        .optional(),
    comment: zod_1.z.string().min(1, { message: "Comment is required" }),
});
