"use client";

import {DiscordPartialGuild, getCurrentUserDojoGuild} from "@/lib/discord";
import {createContext, useContext, useEffect, useState} from "react";
import {useSession} from "next-auth/react";

type Props = {
    children: React.ReactNode
}

type ContextProps = {
    guild: DiscordPartialGuild | null;
    setGuild: (guild: DiscordPartialGuild | null) => void;
}

const DiscordGuildContext = createContext<ContextProps>({
    guild: null,
    setGuild: () => {}
});

export function DiscordGuildProvider({children}: Props) {
    const [guild, setGuild] = useState<DiscordPartialGuild | null>(null);
    const {status} = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            getGuild();
        } else {
            setGuild(null);
        }

        async function getGuild() {
            const dojoGuild = await getCurrentUserDojoGuild();
            setGuild(dojoGuild);
        }
    }, [status]);

    return (
        <DiscordGuildContext.Provider value={{
            guild, setGuild
        }}>
            {children}
        </DiscordGuildContext.Provider>
    )
}

export function useDiscordGuild() {
    const data = useContext(DiscordGuildContext);
    if (!data) {
        throw new Error("Data must be provided");
    }
    return data;
}