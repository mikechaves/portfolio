import Link from "next/link"
import { createPageMetadata } from "@/lib/seo/site"

export const metadata = createPageMetadata({
  title: "Error",
  description: "A portfolio request could not be completed.",
  path: "/error",
  noIndex: true,
  follow: false,
})

interface ErrorPageProps {
  searchParams?: Promise<{ message?: string }>
}

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const message = resolvedSearchParams.message ?? "An unexpected error occurred."

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
