import { NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

/**
 * POST /api/admin/login
 * Body: { password: string }
 * Returns: { success: true, token: string } | { error: string }
 *
 * Simple password-based auth. On success, returns a token
 * that clients should send in subsequent API calls.
 */
export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "密码错误" }, { status: 401 });
    }

    // Simple token: base64(password + salt) for this session
    const token = Buffer.from(`${password}:${Date.now()}`).toString("base64");

    return NextResponse.json({ success: true, token });
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
}
