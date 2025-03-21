/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Explicitly enable SWC
  compiler: {
    // Enables the styled-components SWC transform
    styledComponents: true,
  },
  images: {
    domains: ["placeholder.com"],
  },
  experimental: {
    // Reduce trace collection to avoid stack overflow
    outputFileTracingRoot: undefined,
    outputFileTracingExcludes: {
      "*": ["node_modules/**", ".git/**"],
    },
  },
}

module.exports = nextConfig

