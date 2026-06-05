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

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(false);

  // Restore session
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    if (saved) {
      setToken(saved);
      setLoggedIn(true);
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    if (loggedIn) fetchPosts();
  }, [loggedIn, fetchPosts]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("admin_token", data.token);
        setToken(data.token);
        setLoggedIn(true);
      } else {
        setError(data.error || "登录失败");
      }
    } catch {
      setError("网络错误");
    }
  };

  const handleDelete = async (slug: string, sha: string) => {
    if (!confirm(`确定要删除 "${slug}" 吗？此操作不可撤销。`)) return;
    try {
      const res = await fetch(`${API}/posts?slug=${slug}&sha=${sha}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchPosts();
    } catch {
      alert("删除失败");
    }
  };

  // Categories stats
  const categoryMap = new Map<string, number>();
  posts.forEach((p) => {
    const cat = (p.category as string) || "未分类";
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  });

  // --- Login screen ---
  if (!loggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-100 dark:bg-zinc-900">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg dark:bg-zinc-800"
        >
          <h1 className="mb-6 text-2xl font-bold text-center text-zinc-900 dark:text-zinc-100">
            博客管理后台
          </h1>
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </p>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="管理员密码"
            className="mb-4 w-full rounded-lg border border-zinc-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
            autoFocus
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            登录
          </button>
        </form>
      </div>
    );
  }

  // --- Dashboard ---
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
            className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          >
            仪表盘
          </Link>
          <Link
            href="/admin/posts"
            className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            文章管理
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
            className="rounded-lg px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:bg-zinc-800"
          >
            &larr; 返回网站
          </Link>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_token");
              setLoggedIn(false);
            }}
            className="rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            退出登录
          </button>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 p-8">
        <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          仪表盘
        </h1>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">总文章数</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {posts.length}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">分类数</p>
            <p className="mt-1 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {categoryMap.size}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">最近更新</p>
            <p className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {posts[0]?.title || "-"}
            </p>
          </div>
        </div>

        {/* Category stats */}
        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            分类统计
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(categoryMap.entries()).map(([cat, count]) => (
              <span
                key={cat}
                className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-3 py-1.5 text-sm dark:border-zinc-700"
              >
                <span className="text-zinc-700 dark:text-zinc-300">{cat}</span>
                <span className="rounded-full bg-zinc-100 px-1.5 text-xs text-zinc-500 dark:bg-zinc-800">
                  {count}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Recent posts */}
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
              文章列表
            </h2>
            <Link
              href="/admin/posts/new"
              className="rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              + 新建
            </Link>
          </div>
          {loading ? (
            <p className="p-5 text-sm text-zinc-500">加载中...</p>
          ) : posts.length === 0 ? (
            <p className="p-5 text-sm text-zinc-500">暂无文章</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-100 text-left text-sm text-zinc-500 dark:border-zinc-800">
                  <th className="px-5 py-3 font-medium">标题</th>
                  <th className="px-5 py-3 font-medium">分类</th>
                  <th className="px-5 py-3 font-medium">日期</th>
                  <th className="px-5 py-3 font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {posts.slice(0, 10).map((post) => (
                  <tr
                    key={post.slug}
                    className="border-b border-zinc-50 text-sm dark:border-zinc-800/50"
                  >
                    <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">
                      {post.title || post.slug}
                    </td>
                    <td className="px-5 py-3 text-zinc-600 dark:text-zinc-400">
                      {(post.category as string) || "-"}
                    </td>
                    <td className="px-5 py-3 text-zinc-500 dark:text-zinc-500">
                      {(post.date as string) || "-"}
                    </td>
                    <td className="px-5 py-3 flex gap-2">
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
