import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@uploadthing/react", "uploadthing"],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.md$/,
      type: "asset/source",
    });
    return config;
  },
  experimental: {
    turbo: {
      resolveAlias: {
        "@uploadthing/react": "./node_modules/@uploadthing/react/dist/index.js",
        "@uploadthing/react/native": "./node_modules/@uploadthing/react/native/index.js",
        "@uploadthing/react/next-ssr-plugin": "./node_modules/@uploadthing/react/next-ssr-plugin/index.js",
        "@uploadthing/mime-types": "./node_modules/@uploadthing/mime-types/dist/index.js",
        "@uploadthing/shared": "./node_modules/@uploadthing/shared/dist/index.js",
        "@uploadthing/mime-types/README.md": "./scripts/empty-module.js",
        "@uploadthing/react/README.md": "./scripts/empty-module.js",
      },
      rules: {
        "**/*.md": {
          loaders: ["./scripts/raw-loader.cjs"],
          as: "*.js",
        },
        "**/*.d.cts": {
          loaders: ["./scripts/empty-loader.cjs"],
          as: "*.js",
        },
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com",
      },
    ],
  },
};

export default nextConfig;
