import type { AppProps } from "next/app"
import "@/app/globals.css"
import "./home-platform.css"

export default function PortfolioPagesApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
