import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        ".prisma/client/index-browser": "./node_modules/.prisma/client/index-browser.js",
      },
    },
  },
}

export default nextConfig
