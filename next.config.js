/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: ["*.azurewebsites.net"],
    },
  },
};

module.exports = nextConfig;
