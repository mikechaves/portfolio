import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
import { LabelsProvider } from "@/components/labels-provider"
import { RouteTransition } from "@/components/route-transition"
import { IndustrialNav } from "@/components/industrial-nav"

config.autoAddCss = false

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Mike Chaves | AI Product Systems & Spatial Interfaces",
  description:
    "Industrial 3D portfolio of Mike Chaves, focused on AI product systems, spatial interfaces, and forward-deployed execution.",
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
      <body className={`${jetbrainsMono.variable} industrial-body font-mono min-h-screen flex flex-col`}>
        <div className="industrial-noise" aria-hidden="true" />
        <IndustrialNav />
        <main className="relative z-10 flex-1">
          <RouteTransition>{children}</RouteTransition>
        </main>
        <Footer />
        <LabelsProvider>
          <Toaster />
        </LabelsProvider>
        <Analytics />
      </body>
    </html>
  )
}
