import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/mmm/uploads/**",
      },
      // Add the new domain configuration
      {
        protocol: "https",
        hostname: "matchmeetandmarry.com",
        pathname: "/api/mmm/uploads/**",
      },
      {
        protocol: "https",
        hostname: "mmtamil.co.uk",
        pathname: "/api/mmm/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
   
    ],
  },
  /**
   * Tree-shake heavy icon / date libs so dev compiles (e.g. /matches) stay smaller.
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/optimizePackageImports
   */
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "react-icons",
      "date-fns",
    ],
  },
};

export default nextConfig;