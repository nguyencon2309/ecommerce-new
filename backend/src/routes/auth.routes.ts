import { Router } from "express";
import { createAuth,updateAuth,deleteAuth,getAllAuth } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../controllers/user.controller";
import Author from "../models/Author";
const authRouter = Router()
authRouter.post("/create",protect,isAdmin,createAuth);
authRouter.put("/update/:id",protect,isAdmin,updateAuth);
authRouter.delete("/delete/:id",protect,isAdmin,deleteAuth);
authRouter.get("/getAll",protect,isAdmin,getAllAuth);


export default authRouter