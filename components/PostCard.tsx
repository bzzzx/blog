import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

function formatDate(isoString: string): string {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group rounded-xl border border-zinc-200 p-6 transition-colors hover:border-zinc-300 hover:bg-zinc-50/50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50">
      <div className="flex flex-col gap-2">
        {post.date && (
          <time
            dateTime={post.date}
            className="text-sm text-zinc-500 dark:text-zinc-400"
          >
            {formatDate(post.date)}
          </time>
        )}
        <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          <Link
            href={`/posts/${post.slug}`}
            className="hover:text-blue-600 dark:hover:text-blue-400"
          >
            <span className="absolute inset-0" />
            {post.title}
          </Link>
        </h2>
        {post.description && (
          <p className="line-clamp-2 text-zinc-600 dark:text-zinc-400">
            {post.description}
          </p>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
                className="relative z-10 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
