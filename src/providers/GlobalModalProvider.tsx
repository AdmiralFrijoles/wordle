"use client";

import {createContext, useContext, useState} from "react";
import {UseDisclosureReturn} from "@nextui-org/use-disclosure";

type Props = {
    children: React.ReactNode
}

type ContextProps = {
    register: (modalKey: string, modal: UseDisclosureReturn) => void;
    modals: Map<string, UseDisclosureReturn>;
}

const GlobalModalContext = createContext<ContextProps>({
    register: () => {},
    modals: new Map()
});

export function GlobalModalProvider({children}: Props) {
    const [modals] = useState<Map<string, UseDisclosureReturn>>(new Map());
    function register(id: string, modal: UseDisclosureReturn) {
        modals.set(id, modal);
    }

    return (
        <GlobalModalContext.Provider value={{
            register,
            modals
        }}>
            {children}
        </GlobalModalContext.Provider>
    )
}

export function useGlobalModal(id: string, modal?: UseDisclosureReturn) {
    const data = useContext(GlobalModalContext);
    if (modal) {
        data.register(id, modal);
    }
    return data.modals.get(id);
}