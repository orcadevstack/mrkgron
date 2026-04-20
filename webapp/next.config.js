/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Give static page generation workers more time in resource-constrained environments
  staticPageGenerationTimeout: 180,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.amazonaws.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

module.exports = nextConfig;
