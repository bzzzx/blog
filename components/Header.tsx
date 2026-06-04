import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/80">
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          DevBlog
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Home
          </Link>
          <Link
            href="/tags"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Tags
          </Link>
          <Link
            href="/about"
            className="text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
