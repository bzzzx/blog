import { marked } from "marked";

interface MDXContentProps {
  content: string;
}

/**
 * Renders markdown content as HTML with Tailwind Typography prose styles.
 * Uses `marked` for markdown-to-HTML conversion.
 */
export default function MDXContent({ content }: MDXContentProps) {
  const html = marked.parse(content) as string;

  return (
    <article
      className="prose prose-zinc max-w-none dark:prose-invert
        prose-headings:font-semibold prose-headings:tracking-tight
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
        prose-p:leading-7
        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
        prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal dark:prose-code:bg-zinc-800
        prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-950 prose-pre:text-zinc-100
        prose-img:rounded-lg
        prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/20
        prose-li:marker:text-zinc-400"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
