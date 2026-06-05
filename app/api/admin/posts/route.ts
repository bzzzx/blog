import { NextResponse } from "next/server";
import { listPosts, getPostFile, savePostFile, deletePostFile } from "@/lib/github";

const POSTS_PATH = "content/posts";

/**
 * GET /api/admin/posts
 * List all posts or get a single post by slug.
 *
 * Query params:
 *   slug (optional): get a specific post's full content
 *
 * Returns:
 *   Without slug: Array of { slug, path, sha }
 *   With slug: { slug, content, sha }
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      // Find the file with matching slug across .md/.mdx extensions
      const files = await listPosts();
      const file = files.find(
        (f) =>
          f.name === `${slug}.md` || f.name === `${slug}.mdx`
      );

      if (!file) {
        return NextResponse.json({ error: "文章不存在" }, { status: 404 });
      }

      const { content, sha } = await getPostFile(file.path);
      return NextResponse.json({ slug, content, sha, path: file.path });
    }

    const files = await listPosts();

    const posts = files.map((f) => ({
      slug: f.name.replace(/\.(md|mdx)$/, ""),
      path: f.path,
      sha: f.sha,
    }));

    // Also read frontmatter for listing
    const postsWithMeta = await Promise.all(
      posts.map(async (p) => {
        try {
          const { content } = await getPostFile(p.path);
          const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
          if (fmMatch) {
            const lines = fmMatch[1].split("\n");
            const meta: Record<string, unknown> = {};
            for (const line of lines) {
              const m = line.match(/^(\w+):\s*(.+)$/);
              if (m) {
                const val = m[2].trim().replace(/^["']|["']$/g, "");
                meta[m[1]] = val;
              }
            }
            return { ...p, ...meta };
          }
        } catch {
          // skip malformed files
        }
        return p;
      })
    );

    return NextResponse.json(postsWithMeta);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "服务器错误" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/posts
 * Create or update a post.
 *
 * Body: { slug, title, date, description, tags: [], category, content, sha? }
 *   sha is required for updates (existing file version)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      slug,
      title,
      date,
      description,
      tags,
      category,
      content: postContent,
      sha,
    } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { error: "slug 和 title 不能为空" },
        { status: 400 }
      );
    }

    // Build frontmatter
    const tagsYaml = tags?.length
      ? `\ntags: [${tags.map((t: string) => t.trim()).join(", ")}]`
      : "";
    const categoryYaml = category ? `\ncategory: ${category}` : "";
    const descYaml = description ? `\ndescription: "${description}"` : "";

    const fileContent = `---
title: "${title}"
date: "${date || new Date().toISOString().slice(0, 10)}"${descYaml}${tagsYaml}${categoryYaml}
---

${postContent || ""}
`;

    const filePath = `${POSTS_PATH}/${slug}.mdx`;
    const message = sha
      ? `Update: ${title}`
      : `Create: ${title}`;

    await savePostFile(filePath, fileContent, message, sha);

    return NextResponse.json({
      success: true,
      message: sha ? "文章已更新" : "文章已创建",
      slug,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "保存失败" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/posts?slug=xxx&sha=xxx
 * Delete a post from the repository.
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const sha = searchParams.get("sha");

    if (!slug || !sha) {
      return NextResponse.json(
        { error: "slug 和 sha 参数必填" },
        { status: 400 }
      );
    }

    // Find the exact file
    const files = await listPosts();
    const file = files.find(
      (f) => f.name === `${slug}.md` || f.name === `${slug}.mdx`
    );

    if (!file) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 });
    }

    await deletePostFile(file.path, sha);

    return NextResponse.json({ success: true, message: "文章已删除" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "删除失败" },
      { status: 500 }
    );
  }
}
