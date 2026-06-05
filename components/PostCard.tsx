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
    <article className="group relative rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10">
      <div className="flex flex-col gap-2.5">
        {/* Meta row */}
        <div className="flex items-center gap-3 text-sm">
          {post.date && (
            <time
              dateTime={post.date}
              className="text-[var(--muted)]"
            >
              {formatDate(post.date)}
            </time>
          )}
          {post.category && (
            <>
              <span className="text-[var(--card-border)]">|</span>
              <Link
                href={`/categories/${encodeURIComponent(post.category)}`}
                className="relative z-10 font-medium text-[var(--accent)] hover:underline"
              >
                {post.category}
              </Link>
            </>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold tracking-tight">
          <Link
            href={`/posts/${post.slug}`}
            className="transition-colors hover:text-[var(--accent)]"
          >
            <span className="absolute inset-0" />
            {post.title}
          </Link>
        </h2>

        {/* Description */}
        {post.description && (
          <p className="line-clamp-2 leading-relaxed text-[var(--muted)]">
            {post.description}
          </p>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag.toLowerCase())}`}
                className="relative z-10 rounded-lg bg-[var(--accent-soft)] px-2 py-0.5 text-xs font-medium text-[var(--accent)] transition-colors hover:brightness-95 dark:hover:brightness-125"
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
