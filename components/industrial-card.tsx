import Link from "next/link"
import type { ReactNode } from "react"

type IndustrialCardProps = {
  href?: string
  children: ReactNode
  className?: string
}

export function IndustrialCard({ href, children, className = "" }: IndustrialCardProps) {
  const classes = `industrial-card ${className}`.trim()

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return <div className={classes}>{children}</div>
}
