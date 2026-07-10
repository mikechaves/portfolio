"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { MouseEvent } from "react"
import { useMemo, useState } from "react"
import { ArrowUpRight, Menu, X } from "lucide-react"

export function SiteNav() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navItems = useMemo(
    () => [
      { name: "impact", path: "/" },
      { name: "systems", path: "/projects" },
      { name: "writing", path: "/blog" },
      { name: "about", path: "/about" },
    ],
    [],
  )
  const enterMetaverse = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    window.location.assign("/?metaverse=true")
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <header className="signal-nav h-[4.5rem] border-b border-white/10 bg-black/85 backdrop-blur-md">
        <div className="site-shell h-full">
          <nav aria-label="Main navigation" className="grid h-full grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
            <Link href="/" className="group flex w-fit items-center gap-3 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <span className="tracking-[0.08em] transition-colors group-hover:text-primary">MIKE_CHAVES</span>
              <span className="hidden items-center gap-1.5 text-[0.58rem] font-medium uppercase tracking-[0.16em] text-primary sm:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
                online
              </span>
            </Link>

            <Link
              href="/?metaverse=true"
              onClick={enterMetaverse}
              className="hidden min-h-9 items-center justify-center gap-2 border border-primary/45 px-7 text-xs font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:inline-flex"
            >
              Enter Metaverse <ArrowUpRight size={14} aria-hidden="true" />
            </Link>

            <ul className="hidden items-center justify-end gap-7 md:flex">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`signal-nav-link relative py-2 text-[0.7rem] uppercase tracking-[0.14em] transition-colors hover:text-primary ${
                      pathname === item.path ? "text-primary" : "text-zinc-300"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              className="justify-self-end text-white md:hidden"
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </nav>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="border-b border-primary/25 bg-black/95 backdrop-blur-md md:hidden">
          <ul className="site-shell space-y-px py-3">
            <li className="sm:hidden">
              <Link
                href="/?metaverse=true"
                onClick={(event) => {
                  setIsMobileMenuOpen(false)
                  enterMetaverse(event)
                }}
                className="mb-2 flex items-center justify-between border border-primary/30 px-3 py-2 text-xs uppercase tracking-[0.14em] text-primary"
              >
                Enter Metaverse <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </li>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block border-l-2 px-3 py-2 text-xs uppercase tracking-[0.14em] transition-colors ${
                    pathname === item.path ? "border-primary bg-primary/10 text-primary" : "border-transparent text-white hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
