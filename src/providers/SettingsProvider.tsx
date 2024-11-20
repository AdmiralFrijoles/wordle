"use client";

import {ReactNode, createContext, useContext, useState, useEffect} from "react";
import {useLocalStorage, useMount} from "react-use";

type Props = {
    children?: ReactNode;
};

type ContextProps = {
    isHardMode: boolean;
    setIsHardMode: (value: boolean) => void;

    canSetIsHardMode: boolean;
    setCanSetIsHardMode: (value: boolean) => void;

    isHighContrast: boolean;
    setIsHighContrast: (value: boolean) => void;

    isDarkMode: boolean,
    setIsDarkMode: (value: boolean) => void;
};

const SettingsContext = createContext<ContextProps>({
    isHardMode: false,
    setIsHardMode: () => {},

    canSetIsHardMode: true,
    setCanSetIsHardMode: () => {},

    isHighContrast: false,
    setIsHighContrast: () => {},

    isDarkMode: false,
    setIsDarkMode: () => {}
});

export function SettingsProvider({ children }: Props) {
    const [isHardMode, setIsHardMode] = useLocalStorage<boolean>("setting-is-hard-mode", false);
    const [isHighContrast, setIsHighContrast] = useLocalStorage<boolean>("setting-is-high-contrast", false);
    const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>("setting-is-dark-mode", undefined);
    const [canSetIsHardMode, setCanSetIsHardMode] = useState<boolean>(true);

    useMount(() => {
        if (isDarkMode === undefined) {
            setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
        }
    })

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }

        if (isHighContrast) {
            document.documentElement.classList.add('high-contrast')
        } else {
            document.documentElement.classList.remove('high-contrast')
        }
    }, [isDarkMode, isHighContrast])

    return (
        <SettingsContext.Provider value={{
            isHardMode: (isHardMode ?? false), setIsHardMode,
            canSetIsHardMode, setCanSetIsHardMode,
            isHighContrast: (isHighContrast ?? false), setIsHighContrast,
            isDarkMode: (isDarkMode ?? true), setIsDarkMode
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const data = useContext(SettingsContext);
    if (!data) {
        throw new Error("Data must be provided");
    }
    return data;
}

