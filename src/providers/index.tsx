import React from "react";
import {NextUIProvider} from "@nextui-org/react";
import {SettingsProvider} from "@/providers/SettingsProvider";
import {CurrentPuzzleProvider} from "@/providers/PuzzleProvider";
import {SessionProvider} from "next-auth/react";
import {GlobalModalProvider} from "@/providers/GlobalModalProvider";

export function Providers({children}: {children: React.ReactNode}) {
    return (
        <NextUIProvider>
        <SessionProvider>
        <GlobalModalProvider>
        <CurrentPuzzleProvider>
        <SettingsProvider>
            {children}
        </SettingsProvider>
        </CurrentPuzzleProvider>
        </GlobalModalProvider>
        </SessionProvider>
        </NextUIProvider>
    )
}