import type React from "react"
import type { Metadata } from "next"
import { Barlow_Condensed, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Footer } from "@/components/footer"
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/toaster"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
// Prevent Font Awesome from adding its CSS since we did it manually above
config.autoAddCss = false

// Import our Snow Crash inspired components
import dynamic from "next/dynamic"

// Dynamically import Snow Crash effects to ensure they only load on the client
const SnowCrashEffects = dynamic(
  () => import("@/components/snow-crash-effects").then((m) => m.SnowCrashEffects),
)
import { LabelsProvider } from "@/components/labels-provider"
import { RouteTransition } from "@/components/route-transition"
import { AdaptiveFocusHandoffProvider } from "@/features/adaptive-focus/handoff-context"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
})

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Mike Chaves | AI-Native Design Engineer",
  description:
    "Portfolio of Mike Chaves, designing and building AI-native product systems, human-in-the-loop workflows, operational UX, and immersive interface prototypes.",
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
      <body className={`${jetbrainsMono.variable} ${barlowCondensed.variable} font-mono bg-black text-white min-h-screen flex flex-col`}>
        <div
          className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"
          aria-hidden="true"
        ></div>

        {/* SnowCrashEffects keeps the opt-in Metaverse entry available on the homepage. */}
        <SnowCrashEffects />

        <main className="site-main flex-1 relative z-10">
          <AdaptiveFocusHandoffProvider>
            <RouteTransition>{children}</RouteTransition>
          </AdaptiveFocusHandoffProvider>
        </main>
        <Footer />


        <LabelsProvider>
          <Toaster />
        </LabelsProvider>
        <Analytics />
      </body>
    </html>
  );
}
