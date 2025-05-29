/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["placeholder.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    unoptimized: true,
  },
  transpilePackages: [
    "lucide-react",
    "@fortawesome/react-fontawesome",
    "@fortawesome/free-brands-svg-icons",
    "@fortawesome/free-solid-svg-icons",
    "@fortawesome/fontawesome-svg-core",
    "three",
    "@react-three/fiber",
    "@react-three/drei",
  ],
  // Removed the experimental.appDir option as it's now the default
}

module.exports = nextConfig
