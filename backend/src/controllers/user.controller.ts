import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import { asyncHandler } from "../middlewares/error.middleware";
import { generateToken } from "../utils/auth";
import { Types } from "mongoose";
import { ENV_NODE } from "../config/env";



export const registerUser = asyncHandler(async(req:Request,res:Response) => {
    
    const {name,email,password} = req.body;
    if(!email || !password || !name){
        res.status(400);
        throw new Error("Field can not empty");
    }
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

export const getListUser = asyncHandler(async(req:Request,res:Response) => {
    const listUser = await User.find();
    res.status(201).json({
        stauts:"success",
        data:listUser
    })
})

// export const updateUser = asyncHandler(async(req:Request,res:Response) => {
//     const {name,password} = req.body;
//     const updateUser = await User.findOneAndUpdate({})
// })


export const login = asyncHandler(async(req:Request,res:Response) => {
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("Field can not empty");
    }
    const user = await User.findOne({email});
    if(!user){
        res.status(400);
        throw new Error("Email not yet signup");
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        res.status(400);
        throw new Error("Password is Wrong");
    }
    
    const token = generateToken((user._id as Types.ObjectId).toString());

    res.cookie("token",token,{
        httpOnly:true,
        secure:ENV_NODE ==="production",
        sameSite:"strict",
        maxAge:7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
        message:"login success",
        token:token,
        role:user.role
    })

})

export const logout = asyncHandler( async (req:Request,res:Response) => {
    const user = await User.findById(req.user);
    if(!user){
        res.status(400);
        throw new Error("Not authorized");
    }
    res.clearCookie("token");
    res.status(201).json({
        message:"logout success"
    })

} )
export const isAdmin = asyncHandler(async(req:Request,res:Response, next:NextFunction) => {
    const user = await User.findById(req.user);
    console.log(req.user,user)
    if(!user){
        res.status(400);
        throw new Error("Not authorized");
    }
    if(user.role ==="user"){
        res.status(400);
        throw new Error("You are not Admin");
    }
    next();
})

