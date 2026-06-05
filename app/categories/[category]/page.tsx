import Link from "next/link";
import type { Metadata } from "next";
import { getAllCategories, getPostsByCategory } from "@/lib/posts";
import PostCard from "@/components/PostCard";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const cats = getAllCategories();
  return cats.map(({ category }) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  return {
    title: `分类: ${decodeURIComponent(category)}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const posts = getPostsByCategory(decoded);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/categories"
        className="mb-6 inline-flex text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        &larr; 全部分类
      </Link>

      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {decoded}
      </h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        {posts.length} {posts.length === 1 ? "篇" : "篇"}文章
      </p>

      {posts.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">该分类下暂无文章。</p>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
