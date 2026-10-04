import { Head, Html, Main, NextScript } from "next/document"

export default function PortfolioDocument() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preload" href="/fonts/instrument-serif.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      <body className="cinematic-site min-h-screen flex flex-col">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
