import { NextFunction, Request, Response } from "express";
import Book from "../models/Book";
import { asyncHandler } from "../middlewares/error.middleware"
import { uploadImageToCloudinary } from "../utils/cloudinary";
export const createBook = asyncHandler(async(req:Request,res:Response) => {
    const {title,price,desciption,stock,authorId,generId} = req.body;
    const file = req.file as Express.Multer.File;
    
    if(!file ){
        res.status(400);
        throw new Error("must have image");
    }
    
    // const imageUrls: { [key: string]: string } = {};

    // // Upload từng ảnh dựa trên fieldName
    // for (const field in files) {
    //   const uploadedImage = await uploadImageToCloudinary(files[field][0]);
    //   imageUrls[field] = uploadedImage.secure_url;
    // }
    const bookExist = await Book.findOne({title});
    if(bookExist){
        res.status(400);
        throw new Error("This book already exist");
    }
    const uploadImage = await uploadImageToCloudinary(file);
    const image = uploadImage.secure_url
    const book = await Book.create({title,price,desciption,stock,authorId,generId,image});
    await book.populate(['authorId','generId']);
    res.status(200).json({
        message:"create new book success",
        book
    })

})
export const getListBook = asyncHandler(async(req:Request,res:Response) => {
    const list = await Book.find().populate('authorId').populate('generId');
    
    res.status(200).json({
        message:"success",
        list
    })
})