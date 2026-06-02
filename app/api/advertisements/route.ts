import { NextRequest, NextResponse } from "next/server";

import { getServerToken, laravelFetch } from "@/lib/api";
import type { Advertisement } from "@/lib/types";

export async function POST(request: NextRequest) {
  const token = await getServerToken();
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = await laravelFetch<Advertisement>("/advertisements", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Publish failed",
      },
      { status: 422 }
    );
  }
}
