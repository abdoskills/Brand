import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { prisma } from "@/lib/db";
import { getJwtSecret } from "@/lib/env";

export interface AuthTokenPayload {
  sub: string;
  role: "user" | "admin";
}

export interface AuthUser {
  id: string;
  name: string;
  emailOrPhone: string;
  role: "user" | "admin";
}

const AUTH_COOKIE = "streetwear_token";

export function getAuthCookieName() {
  return AUTH_COOKIE;
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

export async function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export function createAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
}

export async function setAuthCookie(token: string) {
  (await cookies()).set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearAuthCookie() {
  (await cookies()).set(AUTH_COOKIE, "", { maxAge: 0, path: "/" });
}

export function extractToken(request: NextRequest) {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) {
    return header.slice(7);
  }
  const cookieToken = request.cookies.get(AUTH_COOKIE)?.value;
  return cookieToken ?? null;
}

export async function getUserFromRequest(request: NextRequest) {
  try {
    const token = extractToken(request);
    if (!token) {
      return null;
    }
    const payload = verifyAuthToken(token);

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return null;
    }
    return {
      id: user.id,
      name: user.name,
      emailOrPhone: user.emailOrPhone,
      role: user.role as AuthUser["role"],
    } satisfies AuthUser;
  } catch {
    return null;
  }
}

export async function requireUser(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    throw new Response("Unauthorized", { status: 401 });
  }
  return user;
}

export async function requireAdmin(request: NextRequest) {
  const user = await requireUser(request);
  if (user.role !== "admin") {
    throw new Response("Forbidden", { status: 403 });
  }
  return user;
}
