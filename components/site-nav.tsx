"use client"

import * as Dialog from "@radix-ui/react-dialog"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { MouseEvent } from "react"
import { useEffect, useState } from "react"
import { ArrowUpRight, Download, Menu, X } from "lucide-react"
import { trackPortfolioEvent } from "@/lib/portfolio-analytics"
import { isSiteNavItemActive, SITE_NAV_ITEMS } from "./site-nav-state"

export function SiteNav() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hash, setHash] = useState("")

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash)
    syncHash()
    window.addEventListener("hashchange", syncHash)
    return () => window.removeEventListener("hashchange", syncHash)
  }, [pathname])

  const enterMetaverse = (
    event: MouseEvent<HTMLAnchorElement>,
    source: "desktop_nav" | "mobile_nav"
  ) => {
    event.preventDefault()
    trackPortfolioEvent("metaverse_entered", { source })
    window.location.assign("/?metaverse=true")
  }

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      <header className="signal-nav h-[4.5rem] border-b border-white/10 bg-black/85 backdrop-blur-md">
        <div className="site-shell h-full">
          <nav aria-label="Main navigation" className="grid h-full grid-cols-[1fr_auto] items-center gap-5 lg:grid-cols-[auto_1fr_auto]">
            <Link href="/" prefetch={false} className="group flex min-h-11 w-fit items-center gap-3 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <span className="tracking-[0.08em] transition-colors group-hover:text-primary">MIKE_CHAVES</span>
            </Link>

            <ul className="hidden items-center justify-center gap-5 lg:flex xl:gap-7">
              {SITE_NAV_ITEMS.map((item) => {
                const isActive = isSiteNavItemActive(pathname, item.path, hash)
                return (
                  <li key={`${item.name}:${item.path}`}>
                    <Link
                      href={item.path}
                      prefetch={false}
                      aria-current={isActive ? "page" : undefined}
                      className={`signal-nav-link relative py-2 text-[0.68rem] uppercase tracking-[0.12em] transition-colors hover:text-primary ${
                        isActive ? "text-primary" : "text-zinc-300"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="hidden items-center justify-end gap-3 lg:flex">
              <Link
                href="/Michael_Chaves_Resume_min.pdf"
                download
                prefetch={false}
                onClick={() =>
                  trackPortfolioEvent("portfolio_conversion_clicked", {
                    destination: "resume",
                    source: "site_nav",
                  })
                }
                className="site-nav-utility"
              >
                Resume <Download size={13} aria-hidden="true" />
              </Link>
              <Link
                href="/about#contact"
                prefetch={false}
                onClick={() =>
                  trackPortfolioEvent("portfolio_conversion_clicked", {
                    destination: "contact",
                    source: "site_nav",
                  })
                }
                className="site-nav-utility"
              >
                Contact
              </Link>
              <Link
                href="/?metaverse=true"
                prefetch={false}
                onClick={(event) => enterMetaverse(event, "desktop_nav")}
                className="site-nav-metaverse"
              >
                Metaverse <ArrowUpRight size={13} aria-hidden="true" />
              </Link>
            </div>

            <Dialog.Root open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  className="inline-flex h-11 w-11 items-center justify-center justify-self-end border border-white/20 text-white transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
                  aria-label="Open menu"
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="site-mobile-menu"
                >
                  <Menu size={22} aria-hidden="true" />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 top-[4.5rem] z-40 bg-black/70 lg:hidden" />
                <Dialog.Content
                  id="site-mobile-menu"
                  aria-describedby={undefined}
                  className="fixed inset-x-0 top-[4.5rem] z-50 border-b border-primary/25 bg-black/[0.98] px-[clamp(0.9rem,2.4vw,2rem)] pb-5 pt-4 shadow-2xl shadow-black focus:outline-none lg:hidden"
                >
                  <div className="mx-auto w-full max-w-[1520px]">
                    <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                      <Dialog.Title className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                        Navigate portfolio
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button
                          type="button"
                          className="inline-flex h-11 w-11 items-center justify-center border border-white/20 text-zinc-200 hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          aria-label="Close menu"
                        >
                          <X size={21} aria-hidden="true" />
                        </button>
                      </Dialog.Close>
                    </div>
                    <nav aria-label="Mobile navigation">
                      <ul className="grid gap-px bg-white/10">
                        {SITE_NAV_ITEMS.map((item) => {
                          const isActive = isSiteNavItemActive(pathname, item.path, hash)
                          return (
                            <li key={`${item.name}:${item.path}`}>
                              <Dialog.Close asChild>
                                <Link
                                  href={item.path}
                                  prefetch={false}
                                  aria-current={isActive ? "page" : undefined}
                                  className={`flex min-h-12 items-center justify-between bg-black px-3 text-sm uppercase tracking-[0.1em] transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary ${
                                    isActive ? "text-primary" : "text-zinc-100"
                                  }`}
                                >
                                  {item.name}
                                  <ArrowUpRight size={14} aria-hidden="true" />
                                </Link>
                              </Dialog.Close>
                            </li>
                          )
                        })}
                      </ul>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Dialog.Close asChild>
                          <Link
                            href="/Michael_Chaves_Resume_min.pdf"
                            download
                            prefetch={false}
                            onClick={() =>
                              trackPortfolioEvent("portfolio_conversion_clicked", {
                                destination: "resume",
                                source: "site_nav",
                              })
                            }
                            className="site-nav-utility"
                          >
                            Resume <Download size={13} aria-hidden="true" />
                          </Link>
                        </Dialog.Close>
                        <Dialog.Close asChild>
                          <Link
                            href="/about#contact"
                            prefetch={false}
                            onClick={() =>
                              trackPortfolioEvent("portfolio_conversion_clicked", {
                                destination: "contact",
                                source: "site_nav",
                              })
                            }
                            className="site-nav-utility"
                          >
                            Contact
                          </Link>
                        </Dialog.Close>
                      </div>
                      <Link
                        href="/?metaverse=true"
                        prefetch={false}
                        onClick={(event) => {
                          setIsMobileMenuOpen(false)
                          enterMetaverse(event, "mobile_nav")
                        }}
                        className="mt-3 flex min-h-12 items-center justify-between border border-primary/35 px-3 text-xs uppercase tracking-[0.12em] text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        Enter Metaverse <ArrowUpRight size={14} aria-hidden="true" />
                      </Link>
                    </nav>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </nav>
        </div>
      </header>
    </div>
  )
}
