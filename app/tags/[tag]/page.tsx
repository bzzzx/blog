import Link from "next/link";
import type { Metadata } from "next";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import PostCard from "@/components/PostCard";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map(({ tag }) => ({ tag: tag.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `Posts tagged "${decodedTag}"`,
    description: `Blog posts tagged with ${decodedTag}`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/tags"
        className="mb-6 inline-flex text-sm text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        &larr; All tags
      </Link>

      <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        {decodedTag}
      </h1>
      <p className="mb-8 text-zinc-500 dark:text-zinc-400">
        {posts.length} {posts.length === 1 ? "post" : "posts"}
      </p>

      {posts.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">
          No posts found with this tag.
        </p>
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
