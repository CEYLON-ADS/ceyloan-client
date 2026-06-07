import { NextRequest, NextResponse } from "next/server";

import { getServerToken, laravelFetch } from "@/lib/api";
import type { Advertisement, Paginated } from "@/lib/types";

export async function GET(request: NextRequest) {
  const token = await getServerToken();
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const size = request.nextUrl.searchParams.get("size") ?? "12";
  const page = request.nextUrl.searchParams.get("page") ?? "1";

  try {
    const data = await laravelFetch<Paginated<Advertisement>>(
      `/advertisements/mine?size=${size}&page=${page}`,
      { token }
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 422;
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to load your ads",
      },
      { status }
    );
  }
}
