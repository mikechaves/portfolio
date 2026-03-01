import Link from "next/link"

interface FocusContextBadgeProps {
  focus: string
}

export function FocusContextBadge({ focus }: FocusContextBadgeProps) {
  const trimmed = focus.trim()
  if (!trimmed) return null

  return (
    <div className="rounded-md border border-primary/30 bg-primary/5 px-4 py-3">
      <p className="text-xs text-muted-foreground mb-1">Current focus</p>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm">{trimmed}</span>
        <Link
          href={`/projects?focus=${encodeURIComponent(trimmed)}`}
          className="text-sm text-primary hover:underline"
        >
          View focused projects
        </Link>
      </div>
    </div>
  )
}
