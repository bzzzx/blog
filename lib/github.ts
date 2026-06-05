/**
 * GitHub API client for blog content management.
 */

const GITHUB_API = "https://api.github.com";
const REPO_OWNER = "bzzzx";
const REPO_NAME = "blog";
const BRANCH = "master";
const POSTS_PATH = "content/posts";

function getToken(): string {
  const token = process.env.GITHUB_PAT;
  if (!token) throw new Error("GITHUB_PAT environment variable is not set");
  return token;
}

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${getToken()}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  content: string;
}

/* ─── List / Read ─── */

export async function listPosts(): Promise<
  { name: string; path: string; sha: string }[]
> {
  const res = await fetch(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${POSTS_PATH}?ref=${BRANCH}`,
    { headers: authHeaders() }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const files = (await res.json()) as GitHubFile[];
  return files
    .filter((f) => f.name.endsWith(".md") || f.name.endsWith(".mdx"))
    .map((f) => ({ name: f.name, path: f.path, sha: f.sha }));
}

export async function getPostFile(
  filePath: string
): Promise<{ content: string; sha: string }> {
  const res = await fetch(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`,
    { headers: authHeaders() }
  );
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data = (await res.json()) as GitHubFile;
  return {
    content: Buffer.from(data.content, "base64").toString("utf8"),
    sha: data.sha,
  };
}

/* ─── Write ─── */

async function putGitHubFile(
  filePath: string,
  base64Content: string,
  commitMessage: string,
  sha?: string
): Promise<void> {
  const body: Record<string, string> = {
    message: commitMessage,
    content: base64Content,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API error: ${res.status} - ${err}`);
  }
}

/**
 * Save a text file (Markdown posts, etc.).
 * Content is UTF-8 text — will be base64-encoded for the GitHub API.
 */
export async function savePostFile(
  filePath: string,
  content: string,
  commitMessage: string,
  sha?: string
): Promise<void> {
  const encoded = Buffer.from(content, "utf8").toString("base64");
  await putGitHubFile(filePath, encoded, commitMessage, sha);
}

/**
 * Save a binary file (images, etc.).
 * Data is already base64-encoded (without data URI prefix).
 */
export async function saveBinaryFile(
  filePath: string,
  base64Data: string,
  commitMessage: string,
  sha?: string
): Promise<void> {
  // Pass through directly — already base64
  await putGitHubFile(filePath, base64Data, commitMessage, sha);
}

/* ─── Delete ─── */

export async function deletePostFile(
  filePath: string,
  sha: string
): Promise<void> {
  const res = await fetch(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
    {
      method: "DELETE",
      headers: authHeaders(),
      body: JSON.stringify({ message: `Delete ${filePath}`, sha, branch: BRANCH }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API error: ${res.status} - ${err}`);
  }
}
