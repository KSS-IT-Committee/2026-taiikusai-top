import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
        pathname: "/*.png",
      },
    ],
  },
  // Self-contained build output (.next/standalone + a minimal server.js) so the
  // production Docker image ships only traced runtime deps. The runner serves
  // with `node server.js` instead of `next start`.
  output: "standalone",
  experimental: {
    // forbidden() (used by AuthGuard for real 403s) requires this experimental
    // flag; pairs with app/forbidden.tsx.
    authInterrupts: true,
    serverActions: {
      // Server Actions cap request bodies at 1MB by default, which a phone
      // photo clears on its own. This is MAX_IMAGE_BYTES (5MB) plus room for
      // what multipart/form-data adds around it.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
