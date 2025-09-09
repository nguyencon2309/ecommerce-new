import express from "express";
import morgan from "morgan";
import cors from "cors";

import type { Request,Response,NextFunction } from "express";
import  {notFound,errorHandler} from "./middlewares/error.middleware"
import userRouter from "./routes/user.routes"
import authRouter from "./routes/auth.routes";
import generRouter from "./routes/gener.routes";

const app = express();


app.use(cors());
app.use(morgan("dev")); // log request
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse form

app.get("/health", (req: Request, res: Response) => {
  res.json({ message:"get health",status: "ok" });
});
app.use("/api/user",userRouter);

app.use("/api/auth",authRouter);
app.use("/api/gener",generRouter);
// catch error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});
app.use(notFound);
app.use(errorHandler);
export default app;
