import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                hostname: 'cdn.discordapp.com',
            }
        ]
    },
    webpack: (config) => {
        config.resolve.fallback = {
            fs: false,
            path: false
        }
        return config;
    },
    async headers() {
        return [{
            source: '/(.*)',
            headers: [
                {
                    key: 'X-Content-Type-Options',
                    value: 'nosniff',
                },
                {
                    key: 'X-Frame-Options',
                    value: 'DENY',
                },
                {
                    key: 'Referrer-Policy',
                    value: 'strict-origin-when-cross-origin',
                },
            ]
        },
        {
            source: '/sw.js',
            headers: [
                {
                    key: 'Content-Type',
                    value: 'application/javascript; charset=utf-8',
                },
                {
                    key: 'Cache-Control',
                    value: 'no-cache, no-store, must-revalidate',
                }
            ],
        }];
    }
};

export default nextConfig;

