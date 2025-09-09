import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/error.middleware";
import Author from "../models/Author";
import Book from "../models/Book";

export const createAuth = asyncHandler(async(req:Request,res:Response) => {
    const {name } = req.body;
    if(!name){
        res.status(400);
        throw new Error("Field can not empty");
    }
    const authExist = await Author.findOne({name});
    if(authExist){
        res.status(400);
        throw new Error("This author already exist");
    }
    const auth = await Author.create({name});
    res.status(201).json({
        message:"add new author succes",
        auth
    })
})

export const updateAuth = asyncHandler(async(req:Request,res:Response) => {
    const {name } = req.body;
    const id = req.params?.id;
    if(!name || !id){
        res.status(400);
        throw new Error("Field can not empty");
    }
    const update = await Author.findByIdAndUpdate(
        id,
        {name},
        {
            new:true
        }
    );
    if(!update){
        res.status(400);
        throw new Error("Author not found");
    }
    res.status(200).json(
        {
            message:"update Author success",
            update
        }
    )
})
export const deleteAuth = asyncHandler(async(req:Request,res:Response) => {
    const id = req.params?.id;
    if( !id){
        res.status(400);
        throw new Error("Field can not empty");
    }
    //delete ref to book 
    const bookCount = await Book.countDocuments({authorId:id});
    if(bookCount > 0){
        res.status(400);
        throw new Error("FCannot delete author because books are still linked");
    }
    const del = await Author.findByIdAndDelete(id)
    if(!del){
        res.status(400);
        throw new Error("Author not found");
    }
    res.status(200).json(
        {
            message:"delete Author success",
            del
        }
    )
})
export const getAllAuth = asyncHandler(async(req:Request,res:Response) => {
    const list = await Author.find();
    res.status(200).json(
        {
            message:"delete Author success",
            list
        }
    )
})