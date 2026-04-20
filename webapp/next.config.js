/** @type {import('next').NextConfig} */

const isGithubPages = process.env.GITHUB_PAGES === "true";

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
    ...(isGithubPages && { unoptimized: true }),
  },
  ...(isGithubPages && {
    output: "export",
    basePath: "/lizconmart",
    assetPrefix: "/lizconmart",
  }),
};

module.exports = nextConfig;
