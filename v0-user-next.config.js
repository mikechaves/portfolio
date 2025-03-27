/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["placeholder.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
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
    "@react-three/drei",
  ],
  // Ensure we're using the App Router
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig

