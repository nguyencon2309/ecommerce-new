import { NextFunction, Request, Response } from "express";
import Order from "../models/Order";
import { asyncHandler } from "../middlewares/error.middleware";
import mongoose from "mongoose";

import Book from "../models/Book";


export const createOrder = asyncHandler(async(req:Request,res:Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const {items,shippingAddress,paymentMethod} = req.body
        const userId = req.user._id;
        if (!items || items.length === 0) {
            res.status(400);
            throw new Error("No items in order");
        }
        let totalPrice = 0;
        const orderItems = []
        for(const item of items){
            const book = await Book.findById(item.book).session(session);
            if(!book){
                res.status(400);
                throw new Error("Book not found");
            }
            if(book.stock < item.quantity){
                res.status(400);
                throw new Error(`Book stock not enough for ${item.quantity}`);
            }
            book.stock -=item.quantity;
            book.sold +=item.quantity;
            await book.save({session});
            orderItems.push({
                book:book._id,
                price:book.price,
                quantity:item.quantity
            })
            totalPrice += item.quantity * book.price;
        }
        const order = await Order.create(
          [
            {
              user: userId,
              items: orderItems,
              totalPrice,
              shippingAddress,
              paymentMethod,
            },
          ],
          { session }
        );

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ status: "success", order: order[0] });
    }
    catch(error){
        await session.abortTransaction();
        session.endSession();
        res.status(400);
        throw error;
    }
    
    

})
// export const createOrder = asyncHandler(async(req:Request,res:Response) => {
    
//         const {items,shippingAddress,paymentMethod} = req.body
//         const userId = req.user._id;
//         if (!items || items.length === 0) {
//             res.status(400);
//             throw new Error("No items in order");
//         }
//         let totalPrice = 0;
//         const orderItems = []
//         for(const item of items){
//             const book = await Book.findById(item.book);
//             if(!book){
//                 res.status(400);
//                 throw new Error("Book not found");
//             }
//             if(book.stock < item.quantity){
//                 res.status(400);
//                 throw new Error(`Book stock not enough for ${item.quantity}`);
//             }
//             book.stock -=item.quantity;
//             book.sold +=item.quantity;
//             await book.save();
//             orderItems.push({
//                 book:book._id,
//                 price:book.price,
//                 quantity:item.quantity
//             })
//             totalPrice += item.quantity * book.price;
//         }
//         const order = await Order.create(
          
//             {
//               user: userId,
//               items: orderItems,
//               totalPrice,
//               shippingAddress,
//               paymentMethod,
//             }
          
//         );

        
//         res.status(201).json({ status: "success", order });
   
    
    

// })

export const updateOrder = asyncHandler(async(req:Request,res:Response) => {
    const id = req.params.id;
    const {shippingAddress,paymentMethod,status} = req.body;
    
    if(!id){
        res.status(400)
        throw new Error("Id Order not found")
    }
    const order = await Order.findById(id);
    if(!order){
        res.status(400)
        throw new Error("Order not found")
    }
    if(req.user._id !== order.user.toString()){
        res.status(404)
        throw new Error("Order not of you");
    }
    if(order.status !== "pending"){
        res.status(400)
        throw new Error("Order already processed")
    }
    if(shippingAddress) order.shippingAddress = shippingAddress;
    if(paymentMethod) order.paymentMethod = paymentMethod;
    if(req.user.role === "admin") order.status = status;
    await order.save();
    res.status(200).json(
        {
            message:"success",
            order
        }
    );
    
 })
export const getListOrderByUser = asyncHandler(async(req:Request,res:Response) => {
    const status = req.params.status;
    
    
    const query : any = {user:req.user._id}
    if(status) query.status = status;

    const listOrder = await Order.find(query)
        .populate({
            path:"items.book",//lấy ref với bảng book
            select:"title price"//chỉ lựa field muốn lấy
        })
        .populate({
            path:"user",
            select:"name email"
        })
        .select('-abc')
        .sort({createdAt:-1});
    res.status(200).json({
        message: "success",
        listOrder
    });    
    


})
export const getAllOrderAdmin = asyncHandler(async(req:Request,res:Response) => {
    //check authen
    if(req.user._id === "user"){
        res.status(404)
        throw new Error("Not authencation");
    }
    const status = req.params.status;
    const userId = req.params.id;
    const query : any = {};
    if(status) query.status = status;
    if(userId) query.user = userId;
    const listOrder = await Order.find(query)
        .populate({
            path:"user",
            select:"name email"
        })
        .populate({
            path:"items.book",
            select:"title price"
        })
        .sort({createdAt:-1});
    res.status(200).json({
        message: "success admin",
        listOrder
    });     
})

