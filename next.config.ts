import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    experimental: {
        optimizePackageImports: ["@chakra-ui/react"]
    },
    webpack: (config) => {
        config.resolve.fallback = {
            fs: false,
            path: false
        }
        return config;
    }
};

export default nextConfig;
