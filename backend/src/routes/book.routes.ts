import Book from "../models/Book";
import { createBook,getListBook,deleteBook,updateBook,updateImageBook} from "../controllers/book.controller";
import { Router } from "express";
import { uploadSingle } from "../middlewares/uploadImage";
import { protect } from "../middlewares/auth.middleware";
//import { isAdmin } from "../controllers/user.controller";
const bookRouter = Router();
bookRouter.post("/create",protect,uploadSingle,createBook);
bookRouter.get("/getList",protect,getListBook);
bookRouter.delete("/delete/:id",protect,deleteBook);
bookRouter.put("/updateBook/:id",protect,updateBook);
bookRouter.put("/updateImageBook/:id",protect,uploadSingle,updateBook)
export default bookRouter;