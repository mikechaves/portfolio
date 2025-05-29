import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
// Prevent Font Awesome from adding its CSS since we did it manually above
config.autoAddCss = false

// Import our Snow Crash inspired components
import { CleanMetaverseNav } from "@/components/clean-metaverse-nav"
import { SumerianVirus } from "@/components/sumerian-virus"
import { KatanaCursor } from "@/components/katana-cursor"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Mike Chaves | UX Designer & Developer",
  description: "Portfolio of Mike Chaves - Designer of immersive, user-centered experiences that push boundaries",
    generator: 'v0.dev'
}

// Loading fallback component for navigation
function NavigationFallback() {
  return (
    <header className="border-b border-border/40 backdrop-blur-sm h-20">
      <div className="container mx-auto px-4 h-full">
        <nav className="flex items-center justify-between h-full">
          <div className="text-xl font-bold text-primary glitch" data-text="MIKE_CHAVES">
            MIKE_CHAVES
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-black/50 border border-primary/30 text-primary rounded-md">Loading...</div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
            <div className="w-20 h-4 bg-gray-700 rounded animate-pulse"></div>
            <div className="w-12 h-4 bg-gray-700 rounded animate-pulse"></div>
            <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} font-mono bg-black text-white min-h-screen flex flex-col`}>
        <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"></div>

        <Suspense fallback={<NavigationFallback />}>
          <CleanMetaverseNav />
        </Suspense>

        <main className="flex-1 container mx-auto px-4 pt-20 pb-8 relative z-10">{children}</main>
        <Footer />

        <SumerianVirus />
        <KatanaCursor />

        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
