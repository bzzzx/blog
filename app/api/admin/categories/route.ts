import { NextResponse } from "next/server";
import { getPostFile, savePostFile } from "@/lib/github";

const CATEGORIES_PATH = "content/categories.json";

/**
 * GET /api/admin/categories
 * Returns the current category list from GitHub.
 */
export async function GET() {
  try {
    const { content } = await getPostFile(CATEGORIES_PATH);
    const categories = JSON.parse(content) as string[];
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}

/**
 * POST /api/admin/categories
 * Body: { action: "add" | "delete", category: string }
 *
 * Add a new category or delete an existing one.
 * Commits the updated categories.json to GitHub.
 */
export async function POST(request: Request) {
  try {
    const { action, category } = await request.json();

    if (!category || !category.trim()) {
      return NextResponse.json({ error: "分类名不能为空" }, { status: 400 });
    }

    const trimmed = category.trim();

    // Get current categories from GitHub
    let categories: string[];
    let sha: string;
    try {
      const file = await getPostFile(CATEGORIES_PATH);
      categories = JSON.parse(file.content) as string[];
      sha = file.sha;
    } catch {
      categories = [];
      sha = "";
    }

    if (action === "add") {
      if (categories.includes(trimmed)) {
        return NextResponse.json({ error: "分类已存在" }, { status: 409 });
      }
      categories.push(trimmed);
    } else if (action === "delete") {
      categories = categories.filter((c) => c !== trimmed);
    } else {
      return NextResponse.json({ error: "无效的 action" }, { status: 400 });
    }

    const newContent = JSON.stringify(categories, null, 2) + "\n";
    await savePostFile(
      CATEGORIES_PATH,
      newContent,
      `${action === "add" ? "Add" : "Delete"} category: ${trimmed}`,
      sha
    );

    return NextResponse.json({ success: true, categories });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "操作失败" },
      { status: 500 }
    );
  }
}
