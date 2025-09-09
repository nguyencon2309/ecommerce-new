import app from "./app";
import { connectDB } from "./config/db";
import { PORT } from "./config/env";
import Multer from "multer"

interface AuthenticatedUser {
  _id: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user:AuthenticatedUser;
      file?:Multer.File,
      files?: Multer.File[] | { [fieldname: string]: Multer.File[] };
    }
  }
}


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
connectDB();