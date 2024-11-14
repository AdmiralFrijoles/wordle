import "./globals.css";
import {Provider} from "@/components/ui/provider"
import {SettingsProvider} from "@/context";
import React from "react";
import type {Metadata} from 'next'
import {Box, VStack} from "@chakra-ui/react";
import Header from "@/components/header";

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
        <html suppressHydrationWarning>
        <body>
        <Provider>
            <SettingsProvider>
                <VStack>
                    <Header />
                    <Box as={"main"} transition="all" transitionDuration="500ms">
                        {children}
                    </Box>
                </VStack>
            </SettingsProvider>
        </Provider>
        </body>
        </html>
    );
}
