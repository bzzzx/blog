import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)]">
      <div className="mx-auto max-w-3xl px-6 py-8 text-center text-sm text-[var(--muted)]">
        <p>
          &copy; {new Date().getFullYear()} DevBlog &mdash; Built with{" "}
          <a
            href="https://nextjs.org"
            className="font-medium underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js
          </a>{" "}
          &amp;{" "}
          <a
            href="https://tailwindcss.com"
            className="font-medium underline underline-offset-4 transition-colors hover:text-[var(--accent)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tailwind CSS
          </a>
        </p>
        <p className="mt-2">
          <Link
            href="/admin"
            className="transition-colors hover:text-[var(--accent)]"
          >
            管理
          </Link>
        </p>
      </div>
    </footer>
  );
}
