import type React from "react"
import "./globals.css"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Mike Chaves | UX Designer & Developer",
  description: "Portfolio of Mike Chaves - Designer of immersive, user-centered experiences that push boundaries",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-mono bg-black text-white min-h-screen flex flex-col">
        <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none z-0"></div>
        <Navigation />
        <main className="flex-1 container mx-auto px-4 py-8 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  )
}



import './globals.css'