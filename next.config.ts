import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow sharp delivery for logos and product photos
    qualities: [75, 90, 95, 100],
  },
};

export default nextConfig;
