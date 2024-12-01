"use server";

import { REST } from '@discordjs/rest';
import {RESTGetAPICurrentUserGuildsResult, Routes} from 'discord-api-types/v10';
import {auth} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {getAppSetting} from "@/lib/settings-service";
import {SETTING_DISCORD_DOJO_ID} from "@/constants/settings";

export interface DiscordPartialGuild {
    id: string;
    name: string;
    icon: string | null;
    banner: string | null;
    owner: boolean;
    features: string[];
    permissions: string;
}

export async function getCurrentUserGuilds(): Promise<DiscordPartialGuild[]> {
    const session = await auth();
    if (!session?.user?.id) {
        throw new Error("Not authorized");
    }

    const account = await prisma.account.findFirst({
        where: {
            userId: session.user.id,
            provider: "discord"
        },
        select: {
            access_token: true,
            providerAccountId: true,
        }
    });

    if (!account?.access_token) {
        console.log("No discord user account with access token found.")
        return [];
    }

    const rest = new REST({ version: '10', authPrefix: 'Bearer' }).setToken(account.access_token);

    try {
        const response: RESTGetAPICurrentUserGuildsResult = await rest.get(Routes.userGuilds())
            .then(r => r as RESTGetAPICurrentUserGuildsResult);
        return response.map(guild => {
            return {
                id: guild.id,
                name: guild.name,
                icon: guild.icon !== null ? rest.cdn.icon(guild.id, guild.icon) : null,
                banner: guild.banner !== null ? rest.cdn.banner(guild.id, guild.banner) : null,
                owner: guild.owner,
                features: guild.features,
                permissions: guild.permissions
            }
        });
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function getCurrentUserDojoGuild(): Promise<DiscordPartialGuild | null> {
    const dojoGuildId = await getAppSetting(SETTING_DISCORD_DOJO_ID);
    if (dojoGuildId) {
        const userGuilds = await getCurrentUserGuilds();
        return userGuilds.find(x => x.id === dojoGuildId) ?? null;
    }
    return null;
}

