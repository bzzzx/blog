import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About this blog and its author",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        About
      </h1>
      <div className="leading-7 [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_p]:mb-3 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1 [&_code]:rounded [&_code]:bg-[var(--accent-soft)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono [&_code]:text-[var(--accent)] [&_pre]:mb-4 [&_pre]:rounded-xl [&_pre]:bg-[#0f0d1a] [&_pre]:p-4 [&_pre_code]:text-gray-100 [&_pre_code]:text-sm">
        <p>
          Welcome to DevBlog! This is a personal tech blog where I document my
          project implementations, technical explorations, and lessons learned
          along the way.
        </p>
        <h2>What You&apos;ll Find Here</h2>
        <ul>
          <li>Step-by-step project implementation guides</li>
          <li>Technical deep dives and architecture decisions</li>
          <li>Code walkthroughs and best practices</li>
          <li>Troubleshooting and debugging experiences</li>
        </ul>
        <h2>How This Blog Works</h2>
        <p>
          All posts are written in Markdown (MDX) and stored in the{" "}
          <code>content/posts/</code> directory. This makes it easy to version
          control, edit, and manage content without a database.
        </p>
        <p>
          To create a new post, simply add a <code>.md</code> or{" "}
          <code>.mdx</code> file to that directory with the following frontmatter:
        </p>
        <pre>
          <code>{`---
title: "Your Post Title"
date: "2024-01-01"
description: "A brief description of your post"
tags: [tag1, tag2]
---

Your markdown content goes here...`}</code>
        </pre>
      </div>
    </div>
  );
}
