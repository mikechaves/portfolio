/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: "/projects/ai-energy-consumption",
        destination: "/archive#ai-energy-context-explorer",
        permanent: true,
      },
    ]
  },
  reactStrictMode: process.env.NODE_ENV === 'production', // Only enable in production
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placeholder.com",
      },
    ],
  },
  transpilePackages: [
    "lucide-react",
    "three",
    "@react-three/fiber",
  ],
  // Removed the experimental.appDir option as it's now the default
}

module.exports = nextConfig
