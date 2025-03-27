import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
// Prevent Font Awesome from adding its CSS since we did it manually above
config.autoAddCss = false

// Import our Snow Crash inspired components
import { MetaverseNav } from "@/components/metaverse-nav"
import { SumerianVirus } from "@/components/sumerian-virus"
import { KatanaCursor } from "@/components/katana-cursor"
// import { BlackSunBadge } from "@/components/black-sun-badge"

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} font-mono bg-black text-white min-h-screen flex flex-col`}>
        <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"></div>

        {/* Use MetaverseNav instead of the regular Navigation */}
        <MetaverseNav />

        {/* Reduced top padding from pt-28 to pt-20 (5rem) */}
        <main className="flex-1 container mx-auto px-4 pt-20 pb-8 relative z-10">{children}</main>
        <Footer />

        {/* Add our Snow Crash inspired components */}
        {/* Black Sun Badge commented out for now - will be reactivated in the future */}
        {/* <BlackSunBadge /> */}
        <SumerianVirus />
        <KatanaCursor />

        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}



import './globals.css'