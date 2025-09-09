import {Router} from "express";
import {registerUser,login,logout,getListUser,deleteUser,updateUser} from "../controllers/user.controller";
import { protect } from "../middlewares/auth.middleware";
const userRouter = Router();
userRouter.post("/register",registerUser);
userRouter.post("/login",login);
userRouter.get("/logout",protect,logout);
userRouter.get("/getList",protect,getListUser);
userRouter.delete("/",protect,deleteUser);
userRouter.post("/update",protect,updateUser);

export default userRouter;