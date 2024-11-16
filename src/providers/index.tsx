import React from "react";
import {NextUIProvider} from "@nextui-org/react";
import {SettingsProvider} from "@/context";

export function Providers({children}: {children: React.ReactNode}) {
    return (
        <NextUIProvider>
        <SettingsProvider>
            {children}
        </SettingsProvider>
        </NextUIProvider>
    )
}