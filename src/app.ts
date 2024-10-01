import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import authRoutes from "./app/modules/auth/auth.route";
import userRoutes from "./app/modules/user/user.route";
import contentRoutes from "./app/modules/content/content.route";
const app: Application = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://petcareclient.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);

// application route
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/contents", contentRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to pet-care server");
});

app.use(globalErrorHandler);

export default app;
