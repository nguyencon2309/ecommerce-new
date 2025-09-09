import { Router } from "express";
import { createGener,updateGener,deleteGener,getAllGener } from "../controllers/gener.controller";
import { protect } from "../middlewares/auth.middleware";
//import { isAdmin } from "../controllers/user.controller";
import Gener from "../models/Gener";
const generRouter = Router()
generRouter.post("/create",protect,createGener);
generRouter.put("/update/:id",protect,updateGener);
generRouter.delete("/delete/:id",protect,deleteGener);
generRouter.get("/getAll",protect,getAllGener);


export default generRouter