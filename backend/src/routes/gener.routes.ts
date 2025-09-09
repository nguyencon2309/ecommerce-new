import { Router } from "express";
import { createGener,updateGener,deleteGener,getAllGener } from "../controllers/gener.controller";
import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../controllers/user.controller";
import Gener from "../models/Gener";
const generRouter = Router()
generRouter.post("/create",protect,isAdmin,createGener);
generRouter.put("/update/:id",protect,isAdmin,updateGener);
generRouter.delete("/delete/:id",protect,isAdmin,deleteGener);
generRouter.get("/getAll",protect,isAdmin,getAllGener);


export default generRouter