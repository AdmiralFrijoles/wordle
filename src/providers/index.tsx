import React from "react";
import {NextUIProvider} from "@nextui-org/react";
import {SettingsProvider} from "@/providers/SettingsProvider";
import {CurrentPuzzleProvider} from "@/providers/PuzzleProvider";
import {SessionProvider} from "next-auth/react";
import {GlobalModalProvider} from "@/providers/GlobalModalProvider";
import {DiscordGuildProvider} from "@/providers/DiscordGuildProvider";

export function Providers({children}: {children: React.ReactNode}) {
    return (
        <NextUIProvider>
        <SessionProvider>
        <GlobalModalProvider>
        <CurrentPuzzleProvider>
        <SettingsProvider>
        <DiscordGuildProvider>
            {children}
        </DiscordGuildProvider>
        </SettingsProvider>
        </CurrentPuzzleProvider>
        </GlobalModalProvider>
        </SessionProvider>
        </NextUIProvider>
    )
}