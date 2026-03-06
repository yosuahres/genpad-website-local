import type { NextConfig } from "next";
import dotenv from "dotenv";
import path from "path";

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
