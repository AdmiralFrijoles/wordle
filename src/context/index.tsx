"use client";

import { ReactNode, createContext, useContext, useState } from "react";

type Props = {
    children?: ReactNode;
};

type ContextProps = {
    isHardMode: boolean;
    setIsHardMode: (value: boolean) => void;
};

const SettingsContext = createContext<ContextProps>({
    isHardMode: false,
    setIsHardMode: () => {},
});

export function SettingsProvider({ children }: Props) {
    const [isHardMode, setIsHardMode] = useState(false);

    const setHardMode = (value: boolean) => {
        setIsHardMode(value);
    }

    return (
        <SettingsContext.Provider value={{ isHardMode, setIsHardMode: setHardMode }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings () {
    const data = useContext(SettingsContext);
    if (!data) {
        throw new Error("Settings must be provided");
    }
    return data;
}

