"use client";

import { useState, useEffect, use } from "react";
import PostEditor from "@/components/PostEditor";
import Link from "next/link";

const API = "/api/admin";

interface EditPageProps {
  params: Promise<{ slug: string }>;
}

export default function EditPostPage({ params }: EditPageProps) {
  const { slug } = use(params);
  const [postData, setPostData] = useState<{
    slug: string;
    title: string;
    date: string;
    description: string;
    tags: string[];
    category: string;
    content: string;
    sha?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("admin_token") || "";
    fetch(`${API}/posts?slug=${encodeURIComponent(slug)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || "加载失败");
        }
        return res.json();
      })
      .then((data) => {
        // Parse frontmatter from raw content
        const content = data.content || "";
        const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

        let title = slug;
        let date = "";
        let description = "";
        let tags: string[] = [];
        let category = "";
        let body = content;

        if (fmMatch) {
          const fm = fmMatch[1];
          body = fmMatch[2].trim();
          const lines = fm.split("\n");
          for (const line of lines) {
            const m = line.match(/^(\w+):\s*(.+)$/);
            if (m) {
              const key = m[1];
              const val = m[2].trim().replace(/^["']|["']$/g, "");
              switch (key) {
                case "title":
                  title = val;
                  break;
                case "date":
                  date = val;
                  break;
                case "description":
                  description = val;
                  break;
                case "tags":
                  tags = val
                    .replace(/[\[\]]/g, "")
                    .split(",")
                    .map((t: string) => t.trim())
                    .filter(Boolean);
                  break;
                case "category":
                  category = val;
                  break;
              }
            }
          }
        }

        setPostData({
          slug: data.slug,
          title,
          date,
          description,
          tags,
          category,
          content: body,
          sha: data.sha,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-zinc-500">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <p className="mb-4 text-red-500">{error}</p>
          <Link href="/admin" className="text-blue-600 hover:underline">
            返回仪表盘
          </Link>
        </div>
      </div>
    );
  }

  if (!postData) return null;

  return <PostEditor editData={postData} />;
}
