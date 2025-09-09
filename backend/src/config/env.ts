import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const MONGO_URI = process.env.MONGO_URI || "";
export const ENV_NODE = process.env.ENV_NODE || "";
export const JWT_SECRET = process.env.JWT_SECRET || 
"default_secret";

export const MAIL_ID = process.env.MAIL_ID;
export const MP = process.env.MP;
export const CLOUD_NAME = process.env.CLOUD_NAME||"";
export const API_KEY = process.env.API_KEY||"";
export const API_SECRET = process.env.API_SECRET||"";
