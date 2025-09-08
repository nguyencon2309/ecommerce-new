import { Request, Response } from "express";
import User from "../models/User";
import { asyncHandler } from "../middlewares/error.middleware";

const registerUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
     const author = new Author({
        _id: new mongoose.Types.ObjectId(),
        name
    });
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export default {registerUser}