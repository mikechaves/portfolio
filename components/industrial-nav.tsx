"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useState } from "react"

const navItems = [
  { label: "Work", href: "/projects" },
  { label: "Systems", href: "/about" },
  { label: "Writing", href: "/blog" },
  { label: "Contact", href: "/about#contact" },
]

export function IndustrialNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="industrial-nav">
      <Link href="/" className="industrial-brand" aria-label="Mike Chaves home">
        Mike Chaves
      </Link>
      <nav className="industrial-nav-links" aria-label="Primary navigation">
        {navItems.map((item) => {
          const active = item.href !== "/about#contact" && pathname === item.href
          return (
            <Link key={item.href} href={item.href} className={active ? "is-active" : undefined}>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <button
        type="button"
        className="industrial-menu-button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <nav className="industrial-mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
