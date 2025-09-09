import Book from "../models/Book";
import { createBook,getListBook,deleteBook,updateBook,updateImageBook} from "../controllers/book.controller";
import { Router } from "express";
import { uploadSingle } from "../middlewares/uploadImage";
import { protect } from "../middlewares/auth.middleware";
import { isAdmin } from "../controllers/user.controller";
const bookRouter = Router();
bookRouter.post("/create",protect,isAdmin,uploadSingle,createBook);
bookRouter.get("/getList",protect,isAdmin,getListBook);
bookRouter.delete("/delete/:id",protect,isAdmin,deleteBook);
bookRouter.put("/updateBook/:id",protect,isAdmin,updateBook);
bookRouter.put("/updateImageBook/:id",protect,isAdmin,uploadSingle,updateBook)
export default bookRouter;