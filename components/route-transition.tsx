"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, type ReactNode } from "react"

export function RouteTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const previousPathname = useRef(pathname)
  const routeChanged = previousPathname.current !== pathname

  useEffect(() => {
    previousPathname.current = pathname
  }, [pathname])

  return (
    <div key={pathname} className={routeChanged ? "route-transition-enter" : undefined}>
      {children}
    </div>
  )
}
