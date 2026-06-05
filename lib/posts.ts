import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export const CATEGORIES = [
  "随想",
  "代码版本更新",
  "项目实现",
  "技术教程",
  "问题排查",
  "工具分享",
] as const;

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  category: string;
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
        category: data.category || "",
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
    category: data.category || "",
    content,
  };
}

/**
 * Get all unique categories with post counts.
 */
export function getAllCategories(): { category: string; count: number }[] {
  const posts = getAllPosts();
  const catMap = new Map<string, number>();

  for (const post of posts) {
    const cat = post.category || "未分类";
    catMap.set(cat, (catMap.get(cat) || 0) + 1);
  }

  return Array.from(catMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

/**
 * Get all posts in a specific category.
 */
export function getPostsByCategory(category: string): PostMeta[] {
  const posts = getAllPosts();
  if (!category || category === "未分类") {
    return posts.filter((p) => !p.category);
  }
  return posts.filter((p) => p.category === category);
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
