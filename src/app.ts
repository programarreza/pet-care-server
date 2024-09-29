import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import userRoutes from "./app/modules/user/user.route";
import authRoutes from "./app/modules/auth/auth.route";

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

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to pet-care server");
});

export default app;
