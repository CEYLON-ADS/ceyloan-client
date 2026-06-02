import { NextResponse } from "next/server";

import { laravelFetch } from "@/lib/api";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const data = await laravelFetch<{ id: string; likesCount: number }>(`/advertisements/${id}/like`, {
      method: "POST",
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to like this ad",
      },
      { status: 422 }
    );
  }
}
