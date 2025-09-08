import mongoose from "mongoose";
import { MONGO_URI } from "./env";
export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
};