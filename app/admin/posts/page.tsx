"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const API = "/api/admin";

interface PostSummary {
  slug: string;
  path: string;
  sha: string;
  title?: string;
  date?: string;
  category?: string;
  tags?: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");

  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("admin_token") || ""
      : "";

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setPosts(await res.json());
    } catch {
      // ignore
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (slug: string, sha: string) => {
    if (!confirm(`确定要删除 "${slug}" 吗？`)) return;
    try {
      await fetch(`${API}/posts?slug=${slug}&sha=${sha}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPosts();
    } catch {
      alert("删除失败");
    }
  };

  const categories = [...new Set(posts.map((p) => p.category || "未分类"))];

  const filtered = posts.filter((p) => {
    const matchSearch =
      !search ||
      (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || (p.category || "未分类") === filterCat;
    return matchSearch && matchCat;
  });

  if (!token) {
    return (
      <div className="p-8 text-center">
        <Link href="/admin" className="text-blue-600 hover:underline">
          请先登录
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-6 text-lg font-bold text-zinc-900 dark:text-zinc-100">
          管理后台
        </h2>
        <nav className="flex flex-col gap-2">
          <Link
            href="/admin"
            className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            仪表盘
          </Link>
          <Link
            href="/admin/posts"
            className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          >
            文章管理
          </Link>
          <Link
            href="/admin/categories"
            className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            分类管理
          </Link>
          <Link
            href="/admin/posts/new"
            className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            + 新建文章
          </Link>
          <hr className="my-2 border-zinc-200 dark:border-zinc-700" />
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-100"
          >
            &larr; 返回网站
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 p-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            文章管理
          </h1>
          <Link
            href="/admin/posts/new"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + 新建文章
          </Link>
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索标题..."
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">全部分类</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {filtered.length < posts.length && (
            <span className="self-center text-sm text-zinc-500">
              筛选: {filtered.length}/{posts.length}
            </span>
          )}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          {loading ? (
            <p className="p-5 text-sm text-zinc-500">加载中...</p>
          ) : filtered.length === 0 ? (
            <p className="p-5 text-sm text-zinc-500">无匹配文章</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 text-left text-sm text-zinc-500 dark:border-zinc-800">
                  <th className="px-5 py-3 font-medium">标题</th>
                  <th className="px-5 py-3 font-medium">分类</th>
                  <th className="px-5 py-3 font-medium">标签</th>
                  <th className="px-5 py-3 font-medium">日期</th>
                  <th className="px-5 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr
                    key={post.slug}
                    className="border-b border-zinc-50 text-sm dark:border-zinc-800/50"
                  >
                    <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100 max-w-xs truncate">
                      {post.title || post.slug}
                    </td>
                    <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
                      {(post.category as string) || "-"}
                    </td>
                    <td className="px-5 py-3 text-zinc-500 dark:text-zinc-500">
                      {(post.tags as string) || "-"}
                    </td>
                    <td className="px-5 py-3 text-zinc-500 dark:text-zinc-500">
                      {(post.date as string) || "-"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/posts/${post.slug}/edit`}
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          编辑
                        </Link>
                        <button
                          onClick={() => handleDelete(post.slug, post.sha)}
                          className="text-red-500 hover:underline"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
