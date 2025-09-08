import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt"
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role : "user" | "admin";
  comparePassword(candidate:string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum : [ "user", "admin" ],
        default : "user"
    }
  },
  { timestamps: true }
);
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})
userSchema.methods.comparePassword = async function (candidate:string){
    return bcrypt.compare(candidate,this.password);
}
export default mongoose.model<IUser>("User", userSchema);
