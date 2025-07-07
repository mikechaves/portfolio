import Link from "next/link"

export default function ErrorPage({
  searchParams,
}: {
  searchParams?: { message?: string }
}) {
  const message = searchParams?.message ?? "An unexpected error occurred."
  return (
    <div className="pt-8 space-y-4">
      <h1 className="text-2xl font-bold">Error</h1>
      <p className="text-muted-foreground">{message}</p>
      <Link href="/" className="text-primary hover:underline">
        Go back home
      </Link>
    </div>
  )
}
