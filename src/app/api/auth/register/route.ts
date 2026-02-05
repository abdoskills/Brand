import { NextResponse } from "next/server";

import { createAuthToken, hashPassword, setAuthCookie } from "@/lib/auth";
import { connectMongo } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const { name, emailOrPhone, password } = await request.json();

    if (!name || !emailOrPhone || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (process.env.MONGODB_URI) {
      await connectMongo();

      const existing = await User.findOne({ emailOrPhone: emailOrPhone.toLowerCase() });
      if (existing) {
        return NextResponse.json({ message: "Account already exists" }, { status: 409 });
      }

      const passwordHash = await hashPassword(password);
      const user = await User.create({
        name,
        emailOrPhone: emailOrPhone.toLowerCase(),
        passwordHash,
        role: "user",
      });

      const token = createAuthToken({ sub: user._id.toString(), role: user.role });
      await setAuthCookie(token);

      return NextResponse.json(
        {
          token,
          user: {
            id: user._id.toString(),
            name: user.name,
            emailOrPhone: user.emailOrPhone,
            role: user.role,
          },
        },
        { status: 201 }
      );
    }

    const fallbackId = `user_${Date.now()}`;
    const token = createAuthToken({ sub: fallbackId, role: "user" });
    await setAuthCookie(token);

    return NextResponse.json(
      {
        token,
        user: {
          id: fallbackId,
          name,
          emailOrPhone: emailOrPhone.toLowerCase(),
          role: "user",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
