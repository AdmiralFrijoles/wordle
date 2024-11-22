import React from "react";
import {NextUIProvider} from "@nextui-org/react";
import {SettingsProvider} from "@/providers/SettingsProvider";
import {CurrentPuzzleProvider} from "@/providers/PuzzleProvider";
import {SessionProvider} from "next-auth/react";

export function Providers({children}: {children: React.ReactNode}) {
    return (
        <NextUIProvider>
        <SessionProvider>
        <CurrentPuzzleProvider>
        <SettingsProvider>
            {children}
        </SettingsProvider>
        </CurrentPuzzleProvider>
        </SessionProvider>
        </NextUIProvider>
    )
}