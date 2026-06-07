import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getServerToken, laravelFetch, TOKEN_COOKIE } from "@/lib/api";

export async function POST(_: NextRequest) {
  const token = await getServerToken();
  if (token) {
    try {
      await laravelFetch<unknown>("/auth/logout", { method: "POST", token });
    } catch {
      // ignore upstream failure, still clear the cookie locally
    }
  }

  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_COOKIE);

  return NextResponse.json({ success: true });
}
