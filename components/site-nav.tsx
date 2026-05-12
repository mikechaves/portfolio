"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"
import { Menu, X } from "lucide-react"

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

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <header className="border-b border-border/40 backdrop-blur-sm h-20">
        <div className="container mx-auto px-4 h-full">
          <nav aria-label="Main navigation" className="flex items-center justify-between h-full">
            <Link href="/" className="text-xl font-bold text-primary glitch" data-text="MIKE_CHAVES">
              MIKE_CHAVES
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="px-4 py-2 bg-black/50 border border-primary/30 text-primary rounded-md hover:bg-primary/20 transition-colors"
              >
                Enter Metaverse
              </Link>
              <button
                className="md:hidden text-white"
                onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            <ul className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`command-prompt hover:text-primary transition-colors ${
                      pathname === item.path ? "text-primary" : "text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border/40 bg-black/95 backdrop-blur-sm">
          <ul className="container mx-auto px-4 py-3 space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-2 py-2 rounded-md transition-colors ${
                    pathname === item.path ? "text-primary bg-primary/10" : "text-white hover:text-primary hover:bg-white/5"
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
