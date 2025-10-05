import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://*.google.com https://*.gstatic.com;",
          },
        ],
      },
    ];
  },
};
