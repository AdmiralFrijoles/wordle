import {MetadataRoute} from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Wordle",
        description: "",
        start_url: "/",
        display: "standalone",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        icons: [
            {
                "src": "favicon.ico",
                "sizes": "64x64 32x32 24x24 16x16",
                "type": "image/x-icon"
            },
            {
                "src": "/pwa/ios/splash_screens/icon.png",
                "sizes": "any",
                "type": "image/png",
                "purpose": "any"
            },
            {
                "src": "favicon-192.png",
                "type": "image/png",
                "sizes": "192x192",
                "purpose": "any"
            },
            {
                "src": "favicon-512.png",
                "type": "image/png",
                "sizes": "512x512",
                "purpose": "any"
            },
            {
                "src": "favicon-192.png",
                "type": "image/png",
                "sizes": "192x192",
                "purpose": "maskable"
            },
            {
                "src": "favicon-512.png",
                "type": "image/png",
                "sizes": "512x512",
                "purpose": "maskable"
            }
        ]
    }
}