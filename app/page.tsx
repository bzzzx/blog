import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import Link from "next/link";

const POSTS_PER_PAGE = 10;

export default async function HomePage() {
  const allPosts = getAllPosts();
  const posts = allPosts.slice(0, POSTS_PER_PAGE);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative border-b border-[var(--card-border)]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-4 py-1.5 text-sm font-medium text-[var(--accent)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            持续记录中
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              DevBlog
            </span>
          </h1>
          <p className="mx-auto max-w-lg text-lg leading-relaxed text-[var(--muted)]">
            记录项目实现过程与技术细节，从代码到部署的完整实践
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/categories"
              className="rounded-xl bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:brightness-110"
            >
              浏览分类
            </Link>
            <Link
              href="/tags"
              className="rounded-xl border border-[var(--card-border)] bg-white px-5 py-2.5 text-sm font-medium transition-all hover:bg-zinc-50 dark:bg-[var(--card-bg)] dark:hover:bg-white/5"
            >
              按标签查看
            </Link>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">最新文章</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              共 {allPosts.length} 篇文章
            </p>
          </div>
          <Link
            href="/categories"
            className="text-sm font-medium text-[var(--accent)] hover:underline"
          >
            按分类浏览 &rarr;
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--card-border)] p-16 text-center">
            <div className="mb-3 text-4xl">📝</div>
            <p className="text-lg font-medium">还没有文章</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              在{" "}
              <code className="rounded-md bg-[var(--accent-soft)] px-1.5 py-0.5 text-xs font-mono">
                content/posts/
              </code>{" "}
              目录下创建你的第一篇文章
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}

        {allPosts.length > POSTS_PER_PAGE && (
          <div className="mt-8 text-center">
            <p className="text-sm text-[var(--muted)]">
              显示 {POSTS_PER_PAGE} / {allPosts.length} 篇
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
