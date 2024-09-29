import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";

// parsers
app.use(express.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to pet-care server");
});

export default app;
