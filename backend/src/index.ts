import app from "./app";
import { connectDB } from "./config/db";
import { PORT } from "./config/env";
import Multer from "multer"

declare global {
  namespace Express {
    interface Request {
      user:String;
      file?:Multer.File,
      files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
    }
  }
}


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
connectDB();