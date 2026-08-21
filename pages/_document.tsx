import { Head, Html, Main, NextScript } from "next/document"

export default function PortfolioDocument() {
  return (
    <Html lang="en">
      <Head />
      <body className="font-mono bg-black text-white min-h-screen flex flex-col">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
