import type { NextConfig } from "next";

// Force the server to use Malaysia Time
process.env.TZ = 'Asia/Kuala_Lumpur';

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
