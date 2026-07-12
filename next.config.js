/** @type {import('next').NextConfig} */
const nextConfig = {
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
    "@fortawesome/react-fontawesome",
    "@fortawesome/free-brands-svg-icons",
    "@fortawesome/free-solid-svg-icons",
    "@fortawesome/fontawesome-svg-core",
    "three",
    "@react-three/fiber",
  ],
  // Removed the experimental.appDir option as it's now the default
}

module.exports = nextConfig
