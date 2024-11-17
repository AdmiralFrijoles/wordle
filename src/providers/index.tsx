import React from "react";
import {NextUIProvider} from "@nextui-org/react";
import {SettingsProvider} from "@/providers/SettingsProvider";
import {Provider as AtomProvider} from "jotai";

export function Providers({children}: {children: React.ReactNode}) {
    return (
        <NextUIProvider>
        <AtomProvider>
        <SettingsProvider>
            {children}
        </SettingsProvider>
        </AtomProvider>
        </NextUIProvider>
    )
}