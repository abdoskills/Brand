import { cookies } from "next/headers";

import { prisma } from "@/lib/db";
import { getAuthCookieName, verifyAuthToken } from "@/lib/auth";

export function verifyJWT(token: string) {
  return verifyAuthToken(token);
}

export async function getAuthUser() {
  try {
    const token = (await cookies()).get(getAuthCookieName())?.value;
    if (!token) return null;
    const payload = verifyAuthToken(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return null;
    return { id: user.id, email: user.emailOrPhone, role: user.role };
  } catch {
    return null;
  }
}
