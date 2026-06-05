import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-white/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:bg-[#0f0d1a]/70 dark:supports-[backdrop-filter]:bg-[#0f0d1a]/60">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent dark:from-indigo-400 dark:to-purple-400"
        >
          DevBlog
        </Link>
        <div className="flex items-center gap-1 text-sm font-medium">
          <Link
            href="/"
            className="rounded-lg px-3 py-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          >
            Home
          </Link>
          <Link
            href="/categories"
            className="rounded-lg px-3 py-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          >
            Categories
          </Link>
          <Link
            href="/tags"
            className="rounded-lg px-3 py-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          >
            Tags
          </Link>
          <Link
            href="/about"
            className="rounded-lg px-3 py-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
