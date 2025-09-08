## Backend book store
Đúng rồi 👍. Flow dựng backend thường sẽ như này:

---

## 🔹 Các bước sau khi có `app.ts` và setup TS

1. **Config kết nối DB**

   * Tuỳ bạn dùng gì:

     * Nếu MySQL/Postgres → thường dùng **Prisma** hoặc **Sequelize**.
     * Nếu MongoDB → dùng **Mongoose**.
   * Bạn tạo một file kiểu:

     ```
     src/config/db.ts
     ```

     để chứa logic connect database.

   Ví dụ (Mongoose):

   ```ts
   import mongoose from "mongoose";

   export const connectDB = async () => {
     try {
       await mongoose.connect(process.env.MONGO_URI as string);
       console.log("✅ MongoDB connected");
     } catch (err) {
       console.error("❌ DB connection failed:", err);
       process.exit(1);
     }
   };
   ```

   Rồi gọi trong `index.ts`:

   ```ts
   import { connectDB } from "./config/db";
   connectDB();
   ```

---

2. **Tạo các model (schema)**

   * Dùng để mapping table/collection.
   * Ví dụ (MongoDB, model User):

     ```
     src/models/user.model.ts
     ```

     ```ts
     import mongoose, { Schema, Document } from "mongoose";

     export interface IUser extends Document {
       name: string;
       email: string;
       password: string;
     }

     const userSchema = new Schema<IUser>(
       {
         name: { type: String, required: true },
         email: { type: String, required: true, unique: true },
         password: { type: String, required: true }
       },
       { timestamps: true }
     );

     export default mongoose.model<IUser>("User", userSchema);
     ```

   👉 Nếu bạn dùng **Prisma**, thay vì model trong code, bạn define trong `schema.prisma` rồi chạy `prisma generate`.

---

3. **Viết routes + controllers**

   * Ví dụ `src/routes/user.routes.ts`:

     ```ts
     import { Router } from "express";
     import { registerUser } from "../controllers/user.controller";

     const router = Router();

     router.post("/register", registerUser);

     export default router;
     ```

   * Và `src/controllers/user.controller.ts`:

     ```ts
     import { Request, Response } from "express";
     import User from "../models/user.model";

     export const registerUser = async (req: Request, res: Response) => {
       try {
         const user = await User.create(req.body);
         res.status(201).json(user);
       } catch (err: any) {
         res.status(400).json({ message: err.message });
       }
     };
     ```

---

4. **Gắn route vào `app.ts`**

   ```ts
   import userRoutes from "./routes/user.routes";
   app.use("/api/users", userRoutes);
   ```

---

## 🔹 Tóm gọn flow project

1. `app.ts` → setup express, middleware.
2. `index.ts` → start server + connect DB.
3. `config/db.ts` → file kết nối DB.
4. `models/` → schema/table.
5. `controllers/` → logic xử lý request.
6. `routes/` → định nghĩa endpoint, map vào controller.

---

👉 Mình có thể viết cho bạn một **sườn project nhỏ (NodeJS + TS + Express + MongoDB với User model)** để bạn copy dán chạy thử. Bạn có muốn không?



Câu hỏi rất quan trọng 👍. Thực ra có **2 cách phổ biến** khi mã hoá mật khẩu (bằng bcrypt hoặc argon2) trong một app Node.js + Mongoose:

---

## 🔹 Cách 1: Hash trong **service / controller** (lúc createUser)

```ts
import bcrypt from "bcrypt";
import User from "../models/User";

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  res.json(user);
};
```

✅ Ưu điểm:

* Rõ ràng, dễ debug.
* Hash logic nằm ngoài model → model giữ vai trò “data schema” đúng nghĩa.

❌ Nhược điểm:

* Nếu bạn quên hash ở một chỗ (ví dụ thêm user bằng script), có thể vô tình lưu mật khẩu plain-text.

---

## 🔹 Cách 2: Hash trong **model (schema middleware)**

```ts
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);

// 🔑 Middleware pre-save để hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔑 Instance method so sánh password
userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
```

✅ Ưu điểm:

* Đảm bảo **mọi nơi** gọi `.save()` hoặc `.create()` đều tự động hash → an toàn hơn.
* Có thể thêm method `comparePassword` ngay trong model, tiện dùng trong login.

❌ Nhược điểm:

* Khó debug hơn một chút vì hash diễn ra “ngầm” trong middleware.

---

## 🔑 Kết luận

* Nếu project **mini để học**: mình khuyên bạn thử **Cách 2 (hash trong model)** → bạn sẽ học thêm về **Mongoose middleware + instance methods**.
* Nếu project **production lớn**: thường vẫn chọn **Cách 2** để giảm rủi ro lưu mật khẩu plain-text.

---

👉 Bạn có muốn mình viết tiếp **route `/auth/register` + `/auth/login`** dùng `createUser` + `comparePassword` để bạn có code hoàn chỉnh luôn không?
