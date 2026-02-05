import { NextResponse } from "next/server";

import { createAuthToken, hashPassword, setAuthCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, emailOrPhone, password } = await request.json();

    if (!name || !emailOrPhone || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const normalized = emailOrPhone.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { emailOrPhone: normalized } });
    if (existing) {
      return NextResponse.json({ message: "Account already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        emailOrPhone: normalized,
        passwordHash,
        role: "user",
      },
    });

    const token = createAuthToken({ sub: user.id, role: user.role as "user" | "admin" });
    await setAuthCookie(token);

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          emailOrPhone: user.emailOrPhone,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
