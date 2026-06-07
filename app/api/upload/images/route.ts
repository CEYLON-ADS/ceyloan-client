import { NextRequest, NextResponse } from "next/server";

import { getServerToken, laravelFetch } from "@/lib/api";

type UploadBody = {
  urls: string[];
};

export async function POST(request: NextRequest) {
  const token = await getServerToken();
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("images");

  if (!files.length || !files.every((f) => f instanceof File)) {
    return NextResponse.json(
      { success: false, message: "At least one image file is required." },
      { status: 422 }
    );
  }

  const upstream = new FormData();
  files.forEach((file) => {
    if (file instanceof File) {
      upstream.append("images[]", file);
    }
  });
  const folder = formData.get("folder");
  if (typeof folder === "string" && folder) {
    upstream.append("folder", folder);
  }

  try {
    const data = await laravelFetch<UploadBody>("/upload/images", {
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
