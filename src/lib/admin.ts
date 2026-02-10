import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import { getAuthCookieName, verifyAuthToken } from "@/lib/auth";

export const ALLOW_ADMIN_FOR_TEST = false;

export async function enforceAdminAccess() {
  if (ALLOW_ADMIN_FOR_TEST) {
    return;
  }

  const cookieName = getAuthCookieName();
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) {
    redirect("/login");
  }

  const payload = verifyAuthToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    redirect("/login");
  }
  if (user.role !== "admin") {
    redirect("/");
  }
}
