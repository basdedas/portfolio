import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google's image server
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
