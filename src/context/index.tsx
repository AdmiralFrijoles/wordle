"use client";

import { ReactNode, createContext, useContext, useState } from "react";

type Props = {
    children?: ReactNode;
};

type ContextProps = {
    isHardMode: boolean;
    setIsHardMode: (value: boolean) => void;
    isHighContrast: boolean;
    setIsHighContrast: (value: boolean) => void;
};

const SettingsContext = createContext<ContextProps>({
    isHardMode: false,
    setIsHardMode: () => {},
    isHighContrast: false,
    setIsHighContrast: () => {}
});

export function SettingsProvider({ children }: Props) {
    const [isHardMode, setIsHardMode] = useState(false);
    const [isHighContrast, setIsHighContrast] = useState(false);

    return (
        <SettingsContext.Provider value={{
            isHardMode, setIsHardMode,
            isHighContrast, setIsHighContrast
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const data = useContext(SettingsContext);
    if (!data) {
        throw new Error("Settings must be provided");
    }
    return data;
}

