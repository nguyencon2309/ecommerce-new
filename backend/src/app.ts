import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import type { Request,Response,NextFunction } from "express";
import  {notFound,errorHandler} from "./middlewares/error.middleware"
import userRouter from "./routes/user.routes"
import authRouter from "./routes/auth.routes";
import generRouter from "./routes/gener.routes";
import bookRouter from "./routes/book.routes";
import orderRouter from "./routes/order.routes";
const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://bookstore-frontend.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(morgan("dev")); // log request
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse form
app.use(cookieParser());
app.get("/health", (req: Request, res: Response) => {
  res.json({ message:"get health",status: "ok" });
});
app.use("/api/user",userRouter);

app.use("/api/author",authRouter);
app.use("/api/gener",generRouter);
app.use("/api/book",bookRouter);
app.use("/api/order",orderRouter);
// catch error
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});
app.use(notFound);
app.use(errorHandler);
export default app;
