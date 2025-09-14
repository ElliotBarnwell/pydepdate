/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // optional, recommended
  output: undefined,     // do NOT use 'export' — keep it dynamic
  // basePath and assetPrefix not needed for Vercel
  experimental: {
    turboMode: true, // optional: enables Turbopack in dev
  },
};

module.exports = nextConfig;