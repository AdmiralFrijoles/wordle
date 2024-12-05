import NextAuth, {type DefaultSession} from "next-auth"
import Discord from "next-auth/providers/discord"
import {PrismaAdapter} from "@auth/prisma-adapter"
import {prisma} from "@/lib/prisma"
//import {REST} from '@discordjs/rest';
//import {Routes} from 'discord-api-types/v10';
//import {RESTPostOAuth2RefreshTokenResult} from "discord-api-types/v10";

declare module "next-auth" {
    interface Session {
        error?: "RefreshTokenError"
        user: {
            role: string
        } & DefaultSession["user"]
    }
}

export const {handlers, signIn, signOut, auth} = NextAuth({
    adapter: PrismaAdapter(prisma),
    callbacks: {
        jwt({token, user}) {
            if (user) { // user is only available on first sign-in
                token.id = user.id!;
            }
            return token;
        },
        async session({session, token}) {
            session.user.id = token.id as string;

            /* This won't work due to edge runtime.
            if (session?.user?.id) {
                const discordAccount = await prisma.account.findFirst({
                    where: {userId: session.user.id, provider: "discord"},
                    select: {
                        refresh_token: true,
                        expires_at: true,
                        providerAccountId: true
                    }
                });

                if (discordAccount?.expires_at && discordAccount.expires_at * 1000 < Date.now()) {
                    try {
                        const rest = new REST({version: '10'});
                        const response = await rest.post(Routes.oauth2TokenExchange(), {
                            auth: false,
                            body: {
                                "grant_type": "refresh_token",
                                "refresh_token": discordAccount.refresh_token
                            }
                        }).then(r => r as RESTPostOAuth2RefreshTokenResult);

                        await prisma.account.update({
                            data: {
                                access_token: response.access_token,
                                expires_at: Math.floor(Date.now() / 1000 + response.expires_in),
                                refresh_token: response.refresh_token ?? discordAccount.refresh_token
                            },
                            where: {
                                provider_providerAccountId: {
                                    provider: "discord",
                                    providerAccountId: discordAccount.providerAccountId
                                },
                            }
                        });

                    } catch (e) {
                        console.error("Error refreshing access_token", e)
                        // If we fail to refresh the token, return an error so we can handle it on the page
                        session.error = "RefreshTokenError"
                    }
                }
            }
            */

            return session
        },
    },
    session: {
        strategy: "jwt"
    },
    providers: [Discord({
        // Do not request email scope, but do request guilds so we can check who is in the Dojo.
        authorization: "https://discord.com/api/oauth2/authorize?scope=identify+guilds",
        profile: (profile) => {
            if (profile.avatar === null) {
                const defaultAvatarNumber =
                    profile.discriminator === "0"
                        ? Number(BigInt(profile.id) >> BigInt(22)) % 6
                        : parseInt(profile.discriminator) % 5
                profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
            } else {
                const format = profile.avatar.startsWith("a_") ? "gif" : "png"
                profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
            }
            return {
                id: profile.id,
                name: profile.global_name ?? profile.username,
                email: profile.email ?? `${profile.id}@discord`,
                image: profile.image_url,
            }
        },
    })]
})
