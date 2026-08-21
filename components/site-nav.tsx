import { ArrowUpRight, Download, Menu, X } from "lucide-react"
import { PortfolioEventLink } from "@/components/portfolio-event-link"
import { SITE_NAV_ITEMS } from "./site-nav-state"

const navLinkClass =
  "signal-nav-link relative py-2 text-[0.68rem] uppercase tracking-[0.12em] text-zinc-300 transition-colors hover:text-primary"
const mobileNavLinkClass =
  "flex min-h-12 items-center justify-between bg-black px-3 text-sm uppercase tracking-[0.1em] text-zinc-100 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"

export function SiteNav() {
  return (
    <div className="fixed inset-x-0 top-0 z-50" data-standard-nav>
      <header className="signal-nav h-[4.5rem] border-b border-white/10 bg-black/85 backdrop-blur-md">
        <div className="site-shell h-full">
          <nav
            aria-label="Main navigation"
            className="grid h-full grid-cols-[1fr_auto] items-center gap-5 lg:grid-cols-[auto_1fr_auto]"
          >
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- native navigation keeps the global shell server-owned */}
            <a
              href="/"
              className="group flex min-h-11 w-fit items-center gap-3 text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="tracking-[0.08em] transition-colors group-hover:text-primary">
                MIKE_CHAVES
              </span>
            </a>

            <ul className="hidden items-center justify-center gap-5 lg:flex xl:gap-7">
              {SITE_NAV_ITEMS.map((item) => (
                <li key={`${item.name}:${item.path}`}>
                  <a
                    href={item.path}
                    className={navLinkClass}
                    data-site-nav-item
                    data-site-nav-path={item.path}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="hidden items-center justify-end gap-3 lg:flex">
              <PortfolioEventLink
                href="/Michael_Chaves_Resume_min.pdf"
                download
                eventName="portfolio_conversion_clicked"
                eventProperties={{ destination: "resume", source: "site_nav" }}
                className="site-nav-utility"
              >
                Resume <Download size={13} aria-hidden="true" />
              </PortfolioEventLink>
              <PortfolioEventLink
                href="/about#contact"
                eventName="portfolio_conversion_clicked"
                eventProperties={{ destination: "contact", source: "site_nav" }}
                className="site-nav-utility"
              >
                Contact
              </PortfolioEventLink>
              <PortfolioEventLink
                href="/?metaverse=true"
                eventName="metaverse_entered"
                eventProperties={{ source: "desktop_nav" }}
                className="site-nav-metaverse"
              >
                Metaverse <ArrowUpRight size={13} aria-hidden="true" />
              </PortfolioEventLink>
            </div>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center justify-self-end border border-white/20 text-white transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
              aria-label="Open menu"
              aria-expanded="false"
              aria-controls="site-mobile-menu"
              data-site-menu-open
            >
              <Menu size={22} aria-hidden="true" />
            </button>

            <dialog
              id="site-mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-labelledby="site-mobile-menu-title"
              className="site-mobile-menu fixed inset-x-0 top-[4.5rem] z-50 m-0 w-full max-w-none border-x-0 border-b border-t-0 border-primary/25 bg-black/[0.98] px-[clamp(0.9rem,2.4vw,2rem)] pb-5 pt-4 text-white shadow-2xl shadow-black focus:outline-none lg:hidden"
              data-site-menu
            >
              <div className="mx-auto w-full max-w-[1520px]">
                <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                  <h2
                    id="site-mobile-menu-title"
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400"
                  >
                    Navigate portfolio
                  </h2>
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 items-center justify-center border border-white/20 text-zinc-200 hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label="Close menu"
                    data-site-menu-close
                  >
                    <X size={21} aria-hidden="true" />
                  </button>
                </div>
                <nav aria-label="Mobile navigation">
                  <ul className="grid gap-px bg-white/10">
                    {SITE_NAV_ITEMS.map((item) => (
                      <li key={`${item.name}:${item.path}`}>
                        <a
                          href={item.path}
                          className={mobileNavLinkClass}
                          data-site-nav-item
                          data-site-nav-path={item.path}
                        >
                          {item.name}
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <PortfolioEventLink
                      href="/Michael_Chaves_Resume_min.pdf"
                      download
                      eventName="portfolio_conversion_clicked"
                      eventProperties={{ destination: "resume", source: "site_nav" }}
                      className="site-nav-utility"
                    >
                      Resume <Download size={13} aria-hidden="true" />
                    </PortfolioEventLink>
                    <PortfolioEventLink
                      href="/about#contact"
                      eventName="portfolio_conversion_clicked"
                      eventProperties={{ destination: "contact", source: "site_nav" }}
                      className="site-nav-utility"
                    >
                      Contact
                    </PortfolioEventLink>
                  </div>
                  <PortfolioEventLink
                    href="/?metaverse=true"
                    eventName="metaverse_entered"
                    eventProperties={{ source: "mobile_nav" }}
                    className="mt-3 flex min-h-12 items-center justify-between border border-primary/35 px-3 text-xs uppercase tracking-[0.12em] text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Enter Metaverse <ArrowUpRight size={14} aria-hidden="true" />
                  </PortfolioEventLink>
                </nav>
              </div>
            </dialog>
          </nav>
        </div>
      </header>
    </div>
  )
}
