"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const API = "/api/admin";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCat, setNewCat] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token =
    typeof window !== "undefined"
      ? sessionStorage.getItem("admin_token") || ""
      : "";

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!newCat.trim()) return;

    try {
      const res = await fetch(`${API}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "add", category: newCat.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        setNewCat("");
        setMessage(`已添加分类「${newCat.trim()}」`);
      } else {
        setError(data.error || "添加失败");
      }
    } catch {
      setError("网络错误");
    }
  };

  const handleDelete = async (cat: string) => {
    if (!confirm(`确定要删除分类「${cat}」吗？已有文章的分类不会受影响。`)) return;
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "delete", category: cat }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
        setMessage(`已删除分类「${cat}」`);
      } else {
        setError(data.error || "删除失败");
      }
    } catch {
      setError("网络错误");
    }
  };

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
          <Link href="/admin" className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">仪表盘</Link>
          <Link href="/admin/posts" className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">文章管理</Link>
          <Link href="/admin/posts/new" className="rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800">+ 新建文章</Link>
          <Link href="/admin/categories" className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">分类管理</Link>
          <hr className="my-2 border-zinc-200 dark:border-zinc-700" />
          <Link href="/" className="rounded-lg px-3 py-2 text-sm text-zinc-500">← 返回网站</Link>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 p-8">
        <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          分类管理
        </h1>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">{error}</p>
        )}
        {message && (
          <p className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/30 dark:text-green-400">{message}</p>
        )}

        {/* Add form */}
        <form onSubmit={handleAdd} className="mb-8 flex gap-3 max-w-md">
          <input
            type="text"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="新分类名称..."
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          />
          <button
            type="submit"
            disabled={!newCat.trim()}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            添加
          </button>
        </form>

        {/* Category list */}
        <div className="max-w-md">
          <h2 className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            现有分类（{categories.length} 个）
          </h2>
          {loading ? (
            <p className="text-sm text-zinc-400">加载中...</p>
          ) : (
            <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <span className="font-medium text-sm text-zinc-800 dark:text-zinc-200">
                    {cat}
                  </span>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="rounded-lg px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors dark:hover:bg-red-900/20"
                  >
                    删除
                  </button>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="px-4 py-6 text-sm text-zinc-400 text-center">
                  暂无分类
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
