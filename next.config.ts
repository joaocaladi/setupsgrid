import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      // Mercado Livre
      {
        protocol: "https",
        hostname: "*.mlstatic.com",
        pathname: "/**",
      },
      // Amazon Brasil
      {
        protocol: "https",
        hostname: "*.media-amazon.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/**",
      },
      // Kabum
      {
        protocol: "https",
        hostname: "images.kabum.com.br",
        pathname: "/**",
      },
      // Magazine Luiza
      {
        protocol: "https",
        hostname: "*.magazineluiza.com.br",
        pathname: "/**",
      },
      // Americanas/Submarino/Shoptime
      {
        protocol: "https",
        hostname: "images-americanas.b2w.io",
        pathname: "/**",
      },
      // Pichau
      {
        protocol: "https",
        hostname: "media.pichau.com.br",
        pathname: "/**",
      },
      // Terabyte
      {
        protocol: "https",
        hostname: "img.terabyteshop.com.br",
        pathname: "/**",
      },
      // AliExpress
      {
        protocol: "https",
        hostname: "*.alicdn.com",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
