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
import { MetaverseNav } from "@/components/metaverse-nav"
import { SumerianVirus } from "@/components/sumerian-virus"
import { KatanaCursor } from "@/components/katana-cursor"
import { LabelsProvider } from "@/components/labels-provider"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
})

export const metadata: Metadata = {
  title: "Mike Chaves | UX Designer & Developer",
  description:
    "Portfolio of Mike Chaves - Designer of immersive, user-centered experiences that push boundaries",
  manifest: "/favicon/site.webmanifest",
  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon-96x96.png",
    apple: "/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "mask-icon",
        url: "/favicon/favicon.svg",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} font-mono bg-black text-white min-h-screen flex flex-col`}>
        <div
          className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"
          aria-hidden="true"
        ></div>

        {/* No fallback - let MetaverseNav handle its own loading */}
        <Suspense>
          <MetaverseNav />
        </Suspense>

        <main className="flex-1 container mx-auto px-4 pt-20 pb-8 relative z-10">
          {children}
        </main>
        <Footer />

        {/* Add our Snow Crash inspired components */}
        <SumerianVirus />
        <KatanaCursor />

        <LabelsProvider>
          <Toaster />
        </LabelsProvider>
        <Analytics />
      </body>
    </html>
  )
}
