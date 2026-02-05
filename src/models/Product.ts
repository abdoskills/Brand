import { Schema, model, models, type Model } from "mongoose";

export type ProductCategory =
  | "accessories"
  | "bottoms"
  | "outerwear"
  | "headwear"
  | "essentials"
  | "hoodies"
  | "tees"
  | "pants"
  | "jackets";

export type ProductBadge =
  | "New"
  | "Hot"
  | "Limited"
  | "Trending"
  | "Best Seller";

export interface IProduct {
  name: string;
  description: string;
  price: number;
  compareAt?: number;
  images: string[];
  category: ProductCategory;
  badge?: ProductBadge;
  ratingAvg: number;
  reviewsCount: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

type ProductModel = Model<IProduct>;

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    compareAt: { type: Number },
    images: { type: [String], default: [] },
    category: {
      type: String,
      required: true,
      enum: [
        "accessories",
        "bottoms",
        "outerwear",
        "headwear",
        "essentials",
        "hoodies",
        "tees",
        "pants",
        "jackets",
      ],
    },
    badge: {
      type: String,
      enum: ["New", "Hot", "Limited", "Trending", "Best Seller"],
      default: undefined,
    },
    ratingAvg: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product =
  (models.Product as ProductModel) ?? model<IProduct>("Product", productSchema);
