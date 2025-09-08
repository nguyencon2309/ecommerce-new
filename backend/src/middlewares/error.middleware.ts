import { Request, Response, NextFunction } from "express";
import { ENV_NODE } from "../config/env";
export const notFound = (req:Request,res:Response,next:NextFunction) => {
    const error = new Error(`Not Found : ${req.originalUrl}`);
    res.status(404);
    next(error);
};

export const errorHandler = (err:Error,req:Request,res:Response,next:NextFunction) => {
    const statusCode = res.statusCode == 200? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        status:"fail",
        message:err?.message,
        stack:ENV_NODE==="production"?null:err?.stack
    });

};
type AsyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler = (fn: AsyncFunction) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
module.exports = {notFound, errorHandler,asyncHandler};