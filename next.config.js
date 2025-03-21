/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["placeholder.com"],
  },
  // Disable static optimization to avoid trace collection issues
  experimental: {
    // Disable features that might cause the stack overflow
    outputFileTracingRoot: undefined,
    outputFileTracingExcludes: {
      "*": ["node_modules/**", ".git/**"],
    },
  },
}

module.exports = nextConfig

