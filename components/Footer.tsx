export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-3xl px-6 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        <p>
          &copy; {new Date().getFullYear()} DevBlog &mdash; Built with{" "}
          <a
            href="https://nextjs.org"
            className="underline underline-offset-4 hover:text-zinc-700 dark:hover:text-zinc-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js
          </a>{" "}
          &amp;{" "}
          <a
            href="https://tailwindcss.com"
            className="underline underline-offset-4 hover:text-zinc-700 dark:hover:text-zinc-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tailwind CSS
          </a>
        </p>
      </div>
    </footer>
  );
}
