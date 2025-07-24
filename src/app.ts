import express, { Application, Request, Response } from "express";
import { bookRoutes } from "./app/controllers/book.controller";
import { borrowRoutes } from "./app/controllers/borrow.controller";

const app: Application = express();
var cors = require("cors");
app.use(express.json());
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is Connected");
});

export default app;
