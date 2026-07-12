export interface SiteNavItem {
  name: string
  path: string
}

export const SITE_NAV_ITEMS: SiteNavItem[] = [
  { name: "impact", path: "/" },
  { name: "systems", path: "/projects" },
  { name: "writing", path: "/blog" },
  { name: "about", path: "/about" },
]

export function isSiteNavItemActive(pathname: string, itemPath: string): boolean {
  if (itemPath === "/") return pathname === "/"
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`)
}
