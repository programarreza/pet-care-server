"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidationSchema = exports.createUserValidationSchema = void 0;
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ invalid_type_error: "name is required" }),
        email: zod_1.z.string({ invalid_type_error: "email is required" }),
        password: zod_1.z.string({ invalid_type_error: "password is required" }),
        phone: zod_1.z.string({ invalid_type_error: "phone is required" }),
        address: zod_1.z.string({ invalid_type_error: "address is required" }),
        image: zod_1.z.string({ invalid_type_error: "image is required" }).optional(),
        role: zod_1.z.enum(["USER", "ADMIN"]).optional(),
    }),
});
exports.createUserValidationSchema = createUserValidationSchema;
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        phone: zod_1.z.string().optional(),
        address: zod_1.z.string().optional(),
    }),
});
exports.updateUserValidationSchema = updateUserValidationSchema;
