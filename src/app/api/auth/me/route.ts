import { NextRequest, NextResponse } from "next/server";

import { clearAuthCookie, getUserFromRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ user });
}

export async function DELETE() {
  await clearAuthCookie();
  return NextResponse.json({ message: "Logged out" });
}
