import "../globals.css";
import React from "react";
import type {Metadata} from 'next'
import Header from "@/components/header";
import {Providers} from "@/providers";
import {Toaster} from "react-hot-toast";
import {getAppSetting} from "@/lib/settings-service";
import {SETTING_APP_DESCRIPTION, SETTING_APP_TITLE} from "@/constants/settings";


export async function generateMetadata(): Promise<Metadata> {
    const title = await getAppSetting<string>(SETTING_APP_TITLE);
    const description = await getAppSetting<string>(SETTING_APP_DESCRIPTION);
    return {
        title: title,
        description: description,
        robots: {
            nosnippet: true,
            notranslate: true,
            noimageindex: true,
            noarchive: true,
            "max-snippet": -1,
            "max-image-preview": "none",
            "max-video-preview": "-1"
        },
        manifest: "/static/favicon/manifest.json",
        icons: {
            icon: "/static/favicon/favicon-192.png",
            apple: "/static/favicon/apple-touch-icon.png",
        }
    }
}

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true} className="dark">
        <body>
        <Providers>
            <div className="flex h-full flex-col">
                <Toaster position="top-center" />
                <Header/>
                <div
                    className="mx-auto flex w-full grow flex-col px-1 pb-8 pt-2 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
                    {children}
                </div>
            </div>
        </Providers>
        </body>
        </html>
    );
}