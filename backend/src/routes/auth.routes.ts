import { Router } from "express";
import { createAuth,updateAuth,deleteAuth,getAllAuth } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";
//import { isAdmin } from "../controllers/user.controller";
import Author from "../models/Author";
const authRouter = Router()
authRouter.post("/create",protect,createAuth);
authRouter.put("/update/:id",protect,updateAuth);
authRouter.delete("/delete/:id",protect,deleteAuth);
authRouter.get("/getAll",protect,getAllAuth);


export default authRouter