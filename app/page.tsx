import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

const POSTS_PER_PAGE = 10;

export default async function HomePage() {
  const allPosts = getAllPosts();
  const posts = allPosts.slice(0, POSTS_PER_PAGE);
  const hasMore = allPosts.length > POSTS_PER_PAGE;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          DevBlog
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          项目实现过程与技术细节的记录
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
          <p className="text-zinc-500 dark:text-zinc-400">
            No posts yet. Create your first post in{" "}
            <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800">
              content/posts/
            </code>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Showing {POSTS_PER_PAGE} of {allPosts.length} posts
          </p>
        </div>
      )}
    </div>
  );
}
