"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const auth_route_1 = __importDefault(require("./app/modules/auth/auth.route"));
const user_route_1 = __importDefault(require("./app/modules/user/user.route"));
const content_route_1 = __importDefault(require("./app/modules/content/content.route"));
const comment_route_1 = __importDefault(require("./app/modules/comment/comment.route"));
const payment_route_1 = require("./app/modules/payment/payment.route");
const app = (0, express_1.default)();
// parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: ["https://petcareclient.vercel.app", "http://localhost:3000"],
    credentials: true,
}));
// application route
app.use("/api/v1/users", user_route_1.default);
app.use("/api/v1/comments", comment_route_1.default);
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/contents", content_route_1.default);
app.use("/api/v1/payments", payment_route_1.paymentRoute);
app.get("/", (req, res) => {
    res.send("Welcome to pet-care server");
});
app.use(globalErrorHandler_1.default);
exports.default = app;
