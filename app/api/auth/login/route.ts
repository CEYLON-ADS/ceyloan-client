import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { laravelFetch, TOKEN_COOKIE } from "@/lib/api";
import type { User } from "@/lib/types";

type LoginResponse = {
  token: string;
  user: User;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email: string; password: string };
    const data = await laravelFetch<LoginResponse>("/auth/email-login", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const response = NextResponse.json({ success: true, data });
    const cookieStore = await cookies();
    cookieStore.set(TOKEN_COOKIE, data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      },
      { status: 422 }
    );
  }
}
