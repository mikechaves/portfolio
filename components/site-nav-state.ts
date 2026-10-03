export interface SiteNavItem {
  name: string
  path: string
}

export const SITE_NAV_ITEMS: SiteNavItem[] = [
  { name: "Work", path: "/projects" },
  { name: "Writing", path: "/blog" },
  { name: "Music", path: "/#music" },
  { name: "About", path: "/about" },
]

export function isSiteNavItemActive(
  pathname: string,
  itemPath: string,
  hash = ""
): boolean {
  const [itemPathname, itemHash = ""] = itemPath.split("#")

  if (itemHash) {
    return pathname === itemPathname && hash === `#${itemHash}`
  }

  if (itemPathname === "/") return pathname === "/"
  return pathname === itemPathname || pathname.startsWith(`${itemPathname}/`)
}
