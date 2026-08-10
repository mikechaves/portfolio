import Link from "next/link"

export default function NotFound() {
  return (
    <div className="site-shell space-y-6 py-16">
      <p className="project-index-eyebrow">404 / Signal not found</p>
      <h1 className="font-display text-5xl font-semibold uppercase text-white">Page not found</h1>
      <p className="max-w-2xl text-sm leading-6 text-zinc-400">
        This route does not point to current public evidence. Continue with the reviewed project
        index or return to the portfolio overview.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          href="/projects"
          className="inline-flex min-h-10 items-center bg-primary px-4 text-xs font-semibold uppercase tracking-[0.1em] text-black"
        >
          Browse reviewed projects
        </Link>
        <Link
          href="/"
          className="inline-flex min-h-10 items-center border border-white/25 px-4 text-xs uppercase tracking-[0.1em] text-zinc-200"
        >
          Return home
        </Link>
      </div>
    </div>
  )
}
