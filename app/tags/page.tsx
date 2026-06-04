import Link from "next/link";
import type { Metadata } from "next";
import { getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Tags",
};

export default function TagsPage() {
  const tags = getAllTags();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Tags
      </h1>

      {tags.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No tags yet.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
            >
              {tag}
              <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                {count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
