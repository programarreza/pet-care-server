import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import userRoutes from "./app/modules/user/user.route";

// parsers
app.use(express.json());
app.use(
  cors({
    origin: ["https://petcareclient.vercel.app", "http://localhost:3000"],
    credentials: true,
  })
);

// application route
app.use("/api/v1/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to pet-care server");
});

export default app;
