import { Schema, model, models, type Model } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  size: "S" | "M" | "L" | "XL";
  image?: string;
}

export type OrderStatus = "preparing" | "shipping" | "shipped" | "cancelled";

export interface IOrder {
  userId: string;
  items: IOrderItem[];
  shipping: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  subtotal: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

type OrderModel = Model<IOrder>;

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true },
    size: { type: String, enum: ["S", "M", "L", "XL"], required: true },
    image: { type: String },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: String, required: true },
    items: { type: [orderItemSchema], default: [] },
    shipping: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["preparing", "shipping", "shipped", "cancelled"],
      default: "preparing",
    },
  },
  { timestamps: true }
);

export const Order = (models.Order as OrderModel) ?? model<IOrder>("Order", orderSchema);
