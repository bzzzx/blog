import { NextResponse } from "next/server";
import { saveBinaryFile } from "@/lib/github";

/**
 * POST /api/admin/upload
 * Upload an image to public/images/ in the GitHub repo.
 *
 * Body (JSON): { filename: string, data: string (base64) }
 * Returns: { url: string }
 */
export async function POST(request: Request) {
  try {
    const { filename, data } = await request.json();

    if (!filename || !data) {
      return NextResponse.json(
        { error: "缺少 filename 或 data" },
        { status: 400 }
      );
    }

    // Sanitize filename
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
    const timestamp = Date.now();
    const fullName = `${timestamp}-${safeName}`;
    const filePath = `public/images/${fullName}`;

    // Extract base64 content (strip data:image/... prefix if present)
    const base64 = data.replace(/^data:image\/\w+;base64,/, "");

    await saveBinaryFile(filePath, base64, `Upload image: ${fullName}`);

    const url = `/images/${fullName}`;

    return NextResponse.json({ success: true, url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "上传失败" },
      { status: 500 }
    );
  }
}
