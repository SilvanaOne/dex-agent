import path from "node:path";
import { withLogtail } from "@logtail/next";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: true,

  webpack(config, { buildId, dev, isServer, defaultLoaders, webpack }) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@dex-agent/lib": path.join(__dirname, "..", "lib"),
    };
    
    // Fix for Prisma client in serverless environment
    if (isServer) {
      // For libquery_engine files
      config.externals = [...(config.externals || []), "prisma", "@prisma/client"];
      
      // Handle the Prisma binary specifically
      const libFolder = path.join(__dirname, "..", "lib");
      config.resolve.alias = {
        ...config.resolve.alias,
        "./src/prisma/libquery_engine-rhel-openssl-3.0.x.so.node": path.join(libFolder, "src/prisma/libquery_engine-rhel-openssl-3.0.x.so.node"),
        "src/prisma/libquery_engine-rhel-openssl-3.0.x.so.node": path.join(libFolder, "src/prisma/libquery_engine-rhel-openssl-3.0.x.so.node")
      };
    }
    
    return config;
  },
  
  // Add this section to properly include Prisma binaries in the Vercel deployment
  output: 'standalone',
  outputFileTracing: true,
  experimental: {
    ...nextConfig.experimental,
    outputFileTracingRoot: path.join(__dirname, '../..'),
    outputFileTracingIncludes: {
      '/packages/lib/src/prisma/**/*': ['*']
    }
  },
};

export default withLogtail(nextConfig);
