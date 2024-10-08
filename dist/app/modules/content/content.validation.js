"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateContentValidationSchema = exports.createContentValidationSchema = void 0;
const zod_1 = require("zod");
// Validation schema for creating content
const createContentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        user: zod_1.z.string({ invalid_type_error: "User ID is required" }), // ObjectId validation
        content: zod_1.z.string({ invalid_type_error: "Content is required" }),
        image: zod_1.z
            .string({ invalid_type_error: "Image is required" })
            .nullable()
            .optional(),
        category: zod_1.z.enum(["STORY", "TIP"], {
            invalid_type_error: "Invalid category",
        }),
        contentType: zod_1.z.enum(["BASIC", "PREMIUM"], {
            invalid_type_error: "Invalid content type",
        }),
        status: zod_1.z.enum(["PUBLISH", "UNPUBLISH"]).optional(),
        isDeleted: zod_1.z.boolean().optional(),
    }),
});
exports.createContentValidationSchema = createContentValidationSchema;
// Validation schema for updating content
const updateContentValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        content: zod_1.z.string().optional(),
        image: zod_1.z.string().nullable().optional(),
        category: zod_1.z.enum(["STORY", "TIP"]).optional(),
        contentType: zod_1.z.enum(["BASIC", "PREMIUM"]).optional(),
        status: zod_1.z.enum(["PUBLISH", "UNPUBLISH"]).optional(),
        isDeleted: zod_1.z.boolean().optional(),
    }),
});
exports.updateContentValidationSchema = updateContentValidationSchema;
