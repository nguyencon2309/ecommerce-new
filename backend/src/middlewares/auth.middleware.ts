import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/env";
import { Request,Response,NextFunction } from "express";

interface JWT_PAYLOAD{
    _id:string,
    role:string
}
export const protect = (req:Request,res:Response,next:NextFunction) =>{
    let token:string|undefined;
    if(req?.headers?.authorization?.startsWith('Bearer')){

        token = req.headers.authorization.split(' ')[1];
    }
    console.log(req);
    if (!token && req.cookies?.token) {
        console.log(1);
        token = req.cookies.token;
        
     }
    
    if(!token){
        res.status(400);
        throw new Error("Not authorized, no token");
    }
    try{
        const decode = jwt.verify(
            token,
            JWT_SECRET
        ) as JWT_PAYLOAD;

        (req as any).user = decode;
        next();
    }
    catch(error){
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
}
