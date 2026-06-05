/**
 * GitHub API client for blog content management.
 * Uses GitHub REST API to read/write files in the repository.
 *
 * Required env var: GITHUB_PAT (Personal Access Token with repo scope)
 */

const GITHUB_API = "https://api.github.com";
const REPO_OWNER = "bzzzx";
const REPO_NAME = "blog";
const BRANCH = "master";
const POSTS_PATH = "content/posts";

function getToken(): string {
  const token = process.env.GITHUB_PAT;
  if (!token) {
    throw new Error("GITHUB_PAT environment variable is not set");
  }
  return token;
}

const headers = () => ({
  Authorization: `Bearer ${getToken()}`,
  Accept: "application/vnd.github.v3+json",
  "Content-Type": "application/json",
});

export interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  content: string; // base64 encoded
}

/**
 * List all files in the posts directory.
 */
export async function listPosts(): Promise<
  { name: string; path: string; sha: string }[]
> {
  const res = await fetch(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${POSTS_PATH}?ref=${BRANCH}`,
    { headers: headers() }
  );

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const files = (await res.json()) as GitHubFile[];
  return files
    .filter((f) => f.name.endsWith(".md") || f.name.endsWith(".mdx"))
    .map((f) => ({ name: f.name, path: f.path, sha: f.sha }));
}

/**
 * Get a single file's content (decoded from base64).
 */
export async function getPostFile(
  filePath: string
): Promise<{ content: string; sha: string }> {
  const res = await fetch(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}?ref=${BRANCH}`,
    { headers: headers() }
  );

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

  const data = (await res.json()) as GitHubFile;
  return {
    content: Buffer.from(data.content, "base64").toString("utf8"),
    sha: data.sha,
  };
}

/**
 * Create or update a file in the repository.
 * Commits directly to the configured branch.
 */
export async function savePostFile(
  filePath: string,
  content: string,
  commitMessage: string,
  sha?: string
): Promise<void> {
  const body: Record<string, string> = {
    message: commitMessage,
    content: Buffer.from(content, "utf8").toString("base64"),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
    {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API error: ${res.status} - ${err}`);
  }
}

/**
 * Delete a file from the repository.
 */
export async function deletePostFile(
  filePath: string,
  sha: string
): Promise<void> {
  const res = await fetch(
    `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`,
    {
      method: "DELETE",
      headers: headers(),
      body: JSON.stringify({
        message: `Delete ${filePath}`,
        sha,
        branch: BRANCH,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API error: ${res.status} - ${err}`);
  }
}
