// import multer, { FileFilterCallback } from "multer";
// import sharp from "sharp";
// import path from "path";
// import fs from "fs";
// import { Request, Response, NextFunction } from "express";

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../public/images"));
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
//   },
// });

// const multerFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Unsupported file format"));
//   }
// };

// export const uploadPhoto = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
//   limits: { fieldSize: 2000000 },
// });

// // Resize ảnh cho product
// export const productImageResize = async (req: Request, res: Response, next: NextFunction) => {
//   if (!req.files) return next();

//   const files = req.files as Express.Multer.File[];
//   await Promise.all(
//     files.map(async (file) => {
//       await sharp(file.path)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(`public/images/products/${file.filename}`);

//       // Xoá file gốc nếu muốn
//       fs.unlinkSync(file.path);
//     })
//   );

//   next();
// };

// // Resize ảnh cho blog
// export const blogImageResize = async (req: Request, res: Response, next: NextFunction) => {
//   if (!req.files) return next();

//   const files = req.files as Express.Multer.File[];
//   await Promise.all(
//     files.map(async (file) => {
//       await sharp(file.path)
//         .resize(300, 300)
//         .toFormat("jpeg")
//         .jpeg({ quality: 90 })
//         .toFile(`public/images/blogs/${file.filename}`);

//       fs.unlinkSync(file.path); // Xoá file gốc
//     })
//   );

//   next();
// };

import multer from 'multer';

// Cấu hình lưu trữ bộ nhớ
const storage = multer.memoryStorage();

// Cấu hình multer để nhận tối đa 5 file
export const upload = multer({
  storage,
  limits: { files: 5 }, // Giới hạn số lượng file
});
export const uploadSingle = upload.single("image");
// export const uploadFields = upload.fields([
//   { name: 'main_image', maxCount: 1 },
//   { name: 'image2', maxCount: 1 },
//   { name: 'image3', maxCount: 1 },
//   { name: 'image4', maxCount: 1 },
//   { name: 'image5', maxCount: 1 },
// ]);

