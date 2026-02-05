import { Schema, model, models, type Model } from "mongoose";

export interface IUser {
  name: string;
  emailOrPhone: string;
  passwordHash: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

type UserModel = Model<IUser>;

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    emailOrPhone: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export const User = (models.User as UserModel) ?? model<IUser>("User", userSchema);
