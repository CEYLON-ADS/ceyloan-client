import { NextRequest, NextResponse } from "next/server";

import { getServerToken, laravelFetch } from "@/lib/api";

type UploadBody = {
  url: string;
};

export async function POST(request: NextRequest) {
  const token = await getServerToken();
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("image");

  if (!file || !(file instanceof File)) {
    return NextResponse.json(
      { success: false, message: "An image file is required." },
      { status: 422 }
    );
  }

  const upstream = new FormData();
  upstream.append("image", file);
  const folder = formData.get("folder");
  if (typeof folder === "string" && folder) {
    upstream.append("folder", folder);
  }

  try {
    const data = await laravelFetch<UploadBody>("/upload/image", {
      method: "POST",
      token,
      body: upstream,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 422;
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Image upload failed",
      },
      { status }
    );
  }
}
