import { NextFunction, Request, Response } from "express";

import { asyncHandler } from "../middlewares/error.middleware";

import Gener from "../models/Gener"


export const createGener = asyncHandler(async(req:Request,res:Response) => {
    const {catelogy } = req.body;
    if(!catelogy){
        res.status(400);
        throw new Error("Field can not empty");
    }
    const generExist = await Gener.findOne({catelogy});
    if(generExist){
        res.status(400);
        throw new Error("This gener already exist");
    }
    const gener = await Gener.create({catelogy});
    res.status(201).json({
        message:"add new gener succes",
        gener
    })
})

export const updateGener = asyncHandler(async(req:Request,res:Response) => {
    const {catelogy } = req.body;
    const id = req.params?.id;
    if(!catelogy || !id){
        res.status(400);
        throw new Error("Field can not empty");
    }
    const update = await Gener.findByIdAndUpdate(
        id,
        {catelogy},
        {
            new:true
        }
    );
    if(!update){
        res.status(400);
        throw new Error("Gener not found");
    }
    res.status(200).json(
        {
            message:"update gener success",
            update
        }
    )
})
export const deleteGener = asyncHandler(async(req:Request,res:Response) => {
    const id = req.params?.id;
    if( !id){
        res.status(400);
        throw new Error("Field can not empty");
    }
    const del = await Gener.findByIdAndDelete(id)
    if(!del){
        res.status(400);
        throw new Error("Gener not found");
    }
    res.status(200).json(
        {
            message:"delete Gener success",
            del
        }
    )
})
export const getAllGener = asyncHandler(async(req:Request,res:Response) => {
    const list = await Gener.find();
    res.status(200).json(
        {
            message:"get all gener success",
            list
        }
    )
})