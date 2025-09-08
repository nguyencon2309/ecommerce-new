import { Request, Response } from "express";
import User from "../models/User";
import { asyncHandler } from "../middlewares/error.middleware";



export const registerUser = asyncHandler(async(req:Request,res:Response) => {
    console.log(req.body)
    const {name,email,password} = req.body;
    const userExist = await User.findOne({email})
    if(userExist){
        res.status(400);
        throw new Error("Email already exist");
    }
    const user = await User.create({ name, email, password });

    res.status(201).json({
        status: "success",
        data: user,
    });
})


