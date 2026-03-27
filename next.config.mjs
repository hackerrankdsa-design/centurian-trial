/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: process.cwd(),
  reactStrictMode: true,
  transpilePackages: ['@fancyapps/ui'],
};

export default nextConfig;

