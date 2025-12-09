// next.config.mjs
import { createRequire } from "module";

const require = createRequire(import.meta.url);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 Add this to make bundler selection explicit & silence the warning
  turbopack: {},

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "**",
      },
    ],
  },

  webpack(config) {
    // Fix: make sure styled-jsx/package.json can always be resolved
    config.resolve.alias["styled-jsx/package.json"] = require.resolve(
      "styled-jsx/package.json"
    );
    return config;
  },
};

export default nextConfig;
