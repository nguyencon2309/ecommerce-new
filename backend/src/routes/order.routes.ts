import Order from "../models/Order";
import { createOrder,updateOrder,getAllOrderAdmin,getListOrderByUser } from "../controllers/order.controller";
import { Router } from "express";

import { protect } from "../middlewares/auth.middleware";

const orderRouter = Router();
orderRouter.post("/create",protect,createOrder);
orderRouter.put("/update",protect,updateOrder);
orderRouter.get("/getListByUser",protect,getListOrderByUser);
orderRouter.get("/getListByAdmin",protect,getAllOrderAdmin);
export default orderRouter;