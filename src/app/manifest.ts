import {MetadataRoute} from "next";
import {getAppSetting} from "@/lib/settings-service";
import {SETTING_APP_DESCRIPTION, SETTING_APP_TITLE} from "@/constants/settings";
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

type Settings = {
    title: string
    description: string
}

export const getServerSideProps = (async () => {
    const title = await getAppSetting<string>(SETTING_APP_TITLE);
    const description = await getAppSetting<string>(SETTING_APP_DESCRIPTION);

    const settings = {
        title: title ?? "Wordle",
        description: description ?? ""
    }

    return { props: {settings} }
}) satisfies GetServerSideProps<{ settings: Settings }>

export default async function manifest(props: InferGetServerSidePropsType<typeof getServerSideProps>): Promise<MetadataRoute.Manifest> {
    return {
        name: props?.settings?.title ?? "Wordle",
        description: props?.settings?.description ?? "",
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