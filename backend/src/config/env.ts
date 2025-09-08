import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI || "";
export const ENV_NODE = process.env.ENV_NODE || "";
export const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
