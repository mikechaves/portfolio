"use client";
import type React from "react";

import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { MetaverseNavFallback } from "@/components/metaverse-nav-fallback";
import { KatanaCursor } from "@/components/katana-cursor";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen flex flex-col">
        <KatanaCursor />
        <MetaverseNavFallback />
        <Navigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
