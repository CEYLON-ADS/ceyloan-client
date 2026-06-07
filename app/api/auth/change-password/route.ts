import { NextRequest, NextResponse } from "next/server";

import { getServerToken, laravelFetch } from "@/lib/api";

type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
};

export async function POST(request: NextRequest) {
  const token = await getServerToken();
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ChangePasswordBody;
    const data = await laravelFetch<unknown>("/auth/change-password", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 422;
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Password change failed",
        errors: (error as { errors?: unknown }).errors,
      },
      { status }
    );
  }
}
