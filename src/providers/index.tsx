import React from "react";
import {NextUIProvider} from "@nextui-org/react";
import {SettingsProvider} from "@/providers/SettingsProvider";
import {Provider as AtomProvider} from "jotai";
import {CurrentPuzzleProvider} from "@/providers/PuzzleProvider";

export function Providers({children}: {children: React.ReactNode}) {
    return (
        <NextUIProvider>
        <AtomProvider>
        <CurrentPuzzleProvider>
        <SettingsProvider>
            {children}
        </SettingsProvider>
        </CurrentPuzzleProvider>
        </AtomProvider>
        </NextUIProvider>
    )
}