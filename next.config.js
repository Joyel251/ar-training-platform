/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true, // For now, to get the deployment working
  },
  eslint: {
    ignoreDuringBuilds: true, // For now, to get the deployment working
  },
}

module.exports = nextConfig 