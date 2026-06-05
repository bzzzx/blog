import { marked } from "marked";

interface MDXContentProps {
  content: string;
}

/**
 * Renders markdown content as styled HTML.
 * Uses manual Tailwind classes instead of the `prose` plugin
 * for Tailwind CSS v4 compatibility.
 */
export default function MDXContent({ content }: MDXContentProps) {
  const html = marked.parse(content) as string;

  return (
    <article
      className="
        /* Typography */
        text-[var(--foreground)] leading-7
        [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight
        [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:tracking-tight
        [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold
        [&_p]:mb-4 [&_p]:leading-7
        [&_a]:font-medium [&_a]:text-[var(--accent)] [&_a]:no-underline hover:[&_a]:underline
        [&_strong]:font-semibold [&_strong]:text-[var(--foreground)]
        /* Lists */
        [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6
        [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6
        [&_li]:mb-1 [&_li]:leading-7
        [&_li::marker]:text-[var(--muted)]
        /* Code */
        [&_code]:rounded-lg [&_code]:bg-[var(--accent-soft)] [&_code]:px-1.5 [&_code]:py-0.5
        [&_code]:text-sm [&_code]:font-normal [&_code]:text-[var(--accent)]
        [&_code]:font-mono
        /* Code blocks */
        [&_pre]:mb-4 [&_pre]:rounded-xl [&_pre]:border [&_pre]:border-[var(--card-border)]
        [&_pre]:bg-[#0f0d1a] [&_pre]:p-4 [&_pre]:overflow-x-auto
        [&_pre_code]:bg-transparent [&_pre_code]:text-gray-100 [&_pre_code]:p-0 [&_pre_code]:text-sm
        /* Images */
        [&_img]:rounded-xl [&_img]:my-6 [&_img]:max-w-full
        /* Blockquotes */
        [&_blockquote]:mb-4 [&_blockquote]:rounded-r-xl [&_blockquote]:border-l-4
        [&_blockquote]:border-l-[var(--accent)] [&_blockquote]:bg-[var(--accent-soft)]
        [&_blockquote]:py-3 [&_blockquote]:px-4 [&_blockquote]:italic
        [&_blockquote_p]:mb-0
        /* Horizontal rule */
        [&_hr]:my-8 [&_hr]:border-[var(--card-border)]
        /* Tables */
        [&_table]:w-full [&_table]:mb-4 [&_table]:border-collapse
        [&_th]:border [&_th]:border-[var(--card-border)] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-[var(--accent-soft)]
        [&_td]:border [&_td]:border-[var(--card-border)] [&_td]:px-3 [&_td]:py-2
        /* Dark mode */
        dark:[&_pre]:bg-[#0a0814]
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
