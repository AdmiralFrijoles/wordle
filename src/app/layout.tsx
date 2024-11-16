import "./globals.css";
import React from "react";
import type {Metadata} from 'next'
import Header from "@/components/header";
import {Providers} from "@/providers";

export const metadata: Metadata = {
    title: "Dojo Wordle",
    description: "A word guessing game for the Dojo",
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

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning={true} className="dark">
        <body>
        <Providers>
            <div className="flex h-full flex-col">
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
