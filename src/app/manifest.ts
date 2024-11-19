import {MetadataRoute} from "next";
import {getAppSetting} from "@/lib/settings-service";
import {SETTING_APP_DESCRIPTION, SETTING_APP_TITLE} from "@/constants/settings";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const title = await getAppSetting<string>(SETTING_APP_TITLE);
    const description = await getAppSetting<string>(SETTING_APP_DESCRIPTION);

    return {
        name: title ?? "Wordle",
        description: description ?? "",
        start_url: "/",
        display: "minimal-ui",
        theme_color: "#0f172a",
        background_color: "#0f172a",
        icons: [
            {
                "src": "favicon.ico",
                "sizes": "64x64 32x32 24x24 16x16",
                "type": "image/x-icon"
            },
            {
                "src": "apple-touch-icon.png",
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
        ],
    }
}