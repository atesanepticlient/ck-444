import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "images.51939393.com",
      "c.animaapp.com",
      "res.cloudinary.com",
      "cdn-test.cdn568.net",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
