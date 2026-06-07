import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getServerToken, laravelFetch } from "@/lib/api";

type ProfileBody = {
  name?: string;
  mobileNumber?: string;
};

export async function PATCH(request: NextRequest) {
  const token = await getServerToken();
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ProfileBody;
    const data = await laravelFetch<unknown>("/auth/profile", {
      method: "PATCH",
      token,
      body: JSON.stringify(body),
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 422;
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Profile update failed",
        errors: (error as { errors?: unknown }).errors,
      },
      { status }
    );
  }
}
