import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/env";
import { Request,Response,NextFunction } from "express";
export const generateToken = (_id: String, role: String): string => {
  return jwt.sign({_id:_id.toString(),role}, JWT_SECRET, { expiresIn: '7d' });
};
export const generateRefreshToken = (_id: String, role: String): string => {
  return jwt.sign({ _id:_id.toString() ,role}, JWT_SECRET, { expiresIn: '7d' });
};


