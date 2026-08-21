export function isSelfOptimizedImage(src: string): boolean {
  const [pathname] = src.split(/[?#]/u, 1)

  return pathname.toLowerCase().endsWith(".webp")
}
