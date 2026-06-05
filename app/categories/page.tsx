import Link from "next/link";
import type { Metadata } from "next";
import { getAllCategories } from "@/lib/posts";

export const metadata: Metadata = {
  title: "分类",
};

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        分类
      </h1>

      {categories.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">暂无分类</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map(({ category, count }) => (
            <Link
              key={category}
              href={`/categories/${encodeURIComponent(category)}`}
              className="group rounded-xl border border-zinc-200 p-6 transition-colors hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50"
            >
              <h2 className="text-lg font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-100 dark:group-hover:text-blue-400">
                {category}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {count} 篇文章
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
