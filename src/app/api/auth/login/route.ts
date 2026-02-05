import { NextResponse } from "next/server";

import { comparePassword, createAuthToken, setAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { emailOrPhone, password } = await request.json();

    if (!emailOrPhone || !password) {
      return NextResponse.json({ message: "Email/phone and password required" }, { status: 400 });
    }

    const normalized = emailOrPhone.toLowerCase();

    const user = await prisma.user.findUnique({ where: { emailOrPhone: normalized } });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = createAuthToken({ sub: user.id, role: user.role as "user" | "admin" });
    await setAuthCookie(token);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        emailOrPhone: user.emailOrPhone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
