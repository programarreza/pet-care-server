"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (res, data) => {
    res.status((data === null || data === void 0 ? void 0 : data.statusCode) || 500).json({
        success: data.success,
        statusCode: data === null || data === void 0 ? void 0 : data.statusCode,
        message: data.message,
        token: data.token,
        data: data.data,
        meta: data.meta,
    });
};
exports.default = sendResponse;
