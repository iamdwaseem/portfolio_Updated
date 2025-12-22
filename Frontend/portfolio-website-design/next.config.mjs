/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["ui-avatars.com", "res.cloudinary.com", "via.placeholder.com"],
  },
}

export default nextConfig
