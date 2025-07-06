"use client"
import { Suspense } from "react"
import type React from "react"

import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { MetaverseNavFallback } from "@/components/metaverse-nav-fallback"
import { KatanaCursor } from "@/components/katana-cursor"

// Loading fallback for navigation components that use client-side hooks
function NavigationFallback() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-[#00ff8c]/20">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-[#00ff8c] font-mono text-xl">
          <div className="h-6 w-32 bg-[#00ff8c]/10 animate-pulse rounded"></div>
        </div>
        <nav>
          <ul className="flex space-x-6">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="h-4 w-16 bg-[#00ff8c]/10 animate-pulse rounded"></li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen flex flex-col">
        <KatanaCursor />
        <Suspense fallback={<NavigationFallback />}>
          <MetaverseNavFallback />
        </Suspense>
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
