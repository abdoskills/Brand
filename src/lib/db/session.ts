import { cookies } from "next/headers";

import { getAuthUser } from "@/lib/auth/server";

export async function getSessionUserId(): Promise<string | null> {
  const user = await getAuthUser();
  return user?.id ?? null;
}
