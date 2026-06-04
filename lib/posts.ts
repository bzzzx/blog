import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

export interface Post extends PostMeta {
  content: string;
}

/**
 * Get all posts sorted by date descending.
 */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter((fileName) => /\.(md|mdx)$/.test(fileName))
    .map((fileName) => {
      const slug = fileName.replace(/\.(md|mdx)$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date ? new Date(data.date).toISOString() : "",
        description: data.description || "",
        tags: data.tags || [],
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

/**
 * Get a single post by slug, including raw markdown content.
 */
export function getPostBySlug(slug: string): Post | null {
  // Try both .md and .mdx extensions
  const extensions = [".mdx", ".md"];
  let fullPath = "";

  for (const ext of extensions) {
    const candidate = path.join(postsDirectory, `${slug}${ext}`);
    if (fs.existsSync(candidate)) {
      fullPath = candidate;
      break;
    }
  }

  if (!fullPath) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    date: data.date ? new Date(data.date).toISOString() : "",
    description: data.description || "",
    tags: data.tags || [],
    content,
  };
}

/**
 * Get all unique tags across all posts, sorted by count.
 */
export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/**
 * Get all posts that have a specific tag.
 */
export function getPostsByTag(tag: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter((post) =>
    post.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}
