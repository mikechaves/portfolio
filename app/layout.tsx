import type React from "react"
import ClientLayout from "./clientLayout"

export const metadata = {
  title: "Mike Hoang | Experience Designer",
  description:
    "Portfolio of Mike Hoang, an Experience Designer specializing in immersive technologies and human-centered design.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'