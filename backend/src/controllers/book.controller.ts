import { NextFunction, Request, Response } from "express";
import Book from "../models/Book";
import { asyncHandler } from "../middlewares/error.middleware"
import { uploadImageToCloudinary ,cloudinaryDeleteImg} from "../utils/cloudinary";
import Author from "../models/Author";
import Gener from "../models/Gener";
export const createBook = asyncHandler(async(req:Request,res:Response) => {

    //check authen
    if(req.user.role === "user"){
        res.status(404)
        throw new Error("Not authencation");
    }

    const {title,price,description,stock,authorId,generId} = req.body;
    const file = req.file as Express.Multer.File;
    if(!title || !price || !description || !stock || !authorId || !generId){
        res.status(400);
        throw new Error("field data empty");
    }
    if(!file   ){
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
    const book = await Book.create({title,price,description,stock,authorId,generId,image});
    await book.populate(['authorId','generId']);
    res.status(200).json({
        message:"create new book success",
        book
    })

})
export const getListBook = asyncHandler(async(req:Request,res:Response) => {
    const {gener,auth,search,sortBy,order} = req.query;
    const limit = parseInt( req.query.limit as string) || 20;
    const page = parseInt(req.query.page as string)||1;
    
    const query :any = {};
    const sortOptions : any ={};
    const [generDoc,authorDoc] = await Promise.all([
        gener ?Gener.findOne({catelogy:gener}) : null,
        auth ? Author.findOne({name:auth}) : null
    ])
    if(gener && !generDoc){
        res.status(400);
        throw new Error(`Gener not found for ${gener}`);
    }
    if(auth && !authorDoc){
        res.status(400);
        throw new Error(`Author not found for ${auth}`);
    }
    if(generDoc) query.generId = generDoc?._id;
    if(authorDoc) query.authorId = authorDoc._id;
    if(search) query.title = { $regex: search, $options: 'i' }
    if(sortBy){
        if(order === "desc") sortOptions[sortBy as string] = -1;
        else sortOptions[sortBy as string] = 1;
    }
    const list = await Book.find(query)
        .populate('authorId')
        .populate('generId')
        .sort(sortOptions)
        .skip((page-1)*limit)
        .limit(limit);
    if(list.length ===0){
        res.status(400);
        throw new Error(`No books found matching the criteria.`)

    }
    res.status(200).json({
        message:"success",
        list
    })
})
export const updateBook = asyncHandler(async(req:Request,res:Response) =>{

        //check authen
    if(req.user.role === "user"){
        res.status(404)
        throw new Error("Not authencation");
    }

    const {title,price,description,stock,authorId,generId} = req.body;
    const _id = req.params?.id;
    if(!title || !price || !description || !stock || !authorId || !generId){
        res.status(400);
        throw new Error("field data empty");
    }
    if(!_id){
        res.status(400);
        throw new Error("not found id book")
    }
    const update = await Book.findByIdAndUpdate(_id,
        {
            title,
            price,
            stock,
            description,
            authorId,
            generId
        },
        {
            new:true
        }
    )
    if(!update){
        res.status(400);
        throw new Error("not found book")
    }
    res.status(200).json({
        message:"success",
        update
    })
    
})
export const updateImageBook = asyncHandler(async(req:Request,res:Response) => {
        //check authen
    if(req.user.role === "user"){
        res.status(404)
        throw new Error("Not authencation");
    }
    const _id = req.params?.id;
    if(!_id){
        res.status(400);
        throw new Error("not found id book")
    }
    const file = req.file as Express.Multer.File;
    
    if(!file  ){
        res.status(400);
        throw new Error("must have image");
    }
    const book = await Book.findById(_id);
    if(!book){
        res.status(400)
        throw new Error("book not found")
    } 
    const updateImage = await uploadImageToCloudinary(file);
    const image = updateImage.secure_url
    await book.updateOne({
        image:image
    })
    res.status(200).json(
        {
            message:"update image success",
            book
        }
    )

})
export const deleteBook = asyncHandler(async(req:Request,res:Response) => {
        //check authen
    if(req.user.role === "user"){
        res.status(404)
        throw new Error("Not authencation");
    }
    const _id = req.params?.id;
    
    const del = await Book.findById(_id);
    if(!del){
        res.status(400)
        throw new Error("book not found")
    }
    if(del.image) await cloudinaryDeleteImg(del.image);
    await del?.deleteOne();
    res.status(200).json(
        {
            message:"delete book success"
        }
    )

})
