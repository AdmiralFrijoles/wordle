"use server";

import {REST} from '@discordjs/rest';
import {
    RESTGetAPICurrentUserGuildsResult,
    RESTGetAPICurrentUserResult,
    RESTPostOAuth2RefreshTokenResult,
    Routes
} from 'discord-api-types/v10';
import {auth} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {getAppSetting} from "@/lib/settings-service";
import {SETTING_DISCORD_DOJO_ID} from "@/constants/settings";
import {DiscordReauthRequiredError} from "@/lib/discord-errors";

const TOKEN_REFRESH_GRACE_SECONDS = 60;

export interface DiscordPartialGuild {
    id: string;
    name: string;
    icon: string | null;
    banner: string | null;
    owner: boolean;
    features: string[];
    permissions: string;
}

export interface DiscordPartialUserProfile {
    id: string;
    username: string;
    avatar: string | null;
}

async function refreshDiscordAccessToken(account: {
    refresh_token: string | null;
    providerAccountId: string;
}): Promise<string | null> {
    if (!account.refresh_token) {
        throw new DiscordReauthRequiredError("Discord access token expired and no refresh_token is stored.");
    }

    const clientId = process.env.AUTH_DISCORD_ID;
    const clientSecret = process.env.AUTH_DISCORD_SECRET;
    if (!clientId || !clientSecret) {
        console.error("Cannot refresh Discord access token: AUTH_DISCORD_ID / AUTH_DISCORD_SECRET not set.");
        return null;
    }

    let response: Response;
    try {
        const params = new URLSearchParams();
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", account.refresh_token);

        response = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
            },
            body: params,
        });
    } catch (e) {
        console.error("Network error refreshing Discord access token", e);
        return null;
    }

    if (!response.ok) {
        const errorBody = await response.text();
        // invalid_grant => the refresh token itself has been revoked or expired
        // (user deauthorized the app, or grant lapsed). Expected; user must
        // re-consent via the OAuth flow.
        if (response.status === 400 && errorBody.includes("invalid_grant")) {
            console.info("Discord refresh token no longer valid; user must re-authenticate.");
            throw new DiscordReauthRequiredError("Discord refresh token is no longer valid.");
        }
        console.error("Failed to refresh Discord access token", response.status, errorBody);
        return null;
    }

    const data = await response.json() as RESTPostOAuth2RefreshTokenResult;

    await prisma.account.update({
        where: {
            provider_providerAccountId: {
                provider: "discord",
                providerAccountId: account.providerAccountId,
            },
        },
        data: {
            access_token: data.access_token,
            refresh_token: data.refresh_token ?? account.refresh_token,
            expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
        },
    });

    return data.access_token;
}

async function getCurrentUserRestClient(): Promise<REST | null> {
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
            refresh_token: true,
            expires_at: true,
            providerAccountId: true,
        }
    });

    if (!account?.access_token) {
        console.log("No discord user account with access token found.")
        return null;
    }

    let accessToken: string | null = account.access_token;
    const now = Math.floor(Date.now() / 1000);
    if (account.expires_at !== null && account.expires_at - TOKEN_REFRESH_GRACE_SECONDS <= now) {
        accessToken = await refreshDiscordAccessToken(account);
        if (!accessToken) return null;
    }

    return new REST({ version: '10', authPrefix: 'Bearer' }).setToken(accessToken);
}

export async function getCurrentUserGuilds(): Promise<DiscordPartialGuild[]> {
    const rest = await getCurrentUserRestClient();
    if (!rest) return [];

    try {
        const response = await rest.get(Routes.userGuilds())
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
        if (e instanceof DiscordReauthRequiredError) throw e;
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

export async function getCurrentUserProfile(): Promise<DiscordPartialUserProfile | null> {
    const rest = await getCurrentUserRestClient();
    if (!rest) return null;

    try {
        const response = await rest.get(Routes.user("@me"))
            .then(r => r as RESTGetAPICurrentUserResult);

        let image_url: string | null;
        if (response.avatar === null) {
            const defaultAvatarNumber =
                response.discriminator === "0"
                    ? Number(BigInt(response.id) >> BigInt(22)) % 6
                    : parseInt(response.discriminator) % 5
            image_url = rest.cdn.defaultAvatar(defaultAvatarNumber);
        } else {
            image_url = rest.cdn.avatar(response.id, response.avatar);
        }

        return {
            id: response.id,
            username: response.global_name ?? response.username,
            avatar: image_url
        }
    } catch (e) {
        if (e instanceof DiscordReauthRequiredError) throw e;
        console.error(e);
        return null;
    }
}

