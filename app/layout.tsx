import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { KatanaCursor } from "@/components/katana-cursor";
import { Analytics } from "@vercel/analytics/react";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cyberpunk Portfolio",
  description: "A cyberpunk-themed portfolio showcasing my work and skills",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-black text-white min-h-screen flex flex-col`}
      >
        <Suspense>
          <Navigation />
        </Suspense>
        <main className="flex-grow">{children}</main>
        <Footer />
        <KatanaCursor />
        <Analytics />
      </body>
    </html>
  );
}
