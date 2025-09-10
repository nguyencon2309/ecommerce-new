import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  book: mongoose.Types.ObjectId;   
  quantity: number;
  price: number;                   
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;   // ref tới User
  items: IOrderItem[];
  totalPrice: number;
  shippingAddress: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "canceled";
  paymentMethod: "cod" | "credit_card" | "paypal";
}

const orderItemSchema = new Schema<IOrderItem>({
  book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
});

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "credit_card", "paypal"],
      default: "cod",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);
