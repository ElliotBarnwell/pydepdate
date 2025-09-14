import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
    basePath: isProd ? "/repo-name" : "",
  assetPrefix: isProd ? "/repo-name/" : "",
};

export default nextConfig;
