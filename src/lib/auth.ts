import NextAuth, {type DefaultSession} from "next-auth"
import Discord from "next-auth/providers/discord"
import {PrismaAdapter} from "@auth/prisma-adapter"
import {prisma} from "@/lib/prisma"

declare module "next-auth" {
    interface Session {
        user: {
            role: string
        } & DefaultSession["user"]
    }
}

export const {handlers, signIn, signOut, auth} = NextAuth({
    adapter: PrismaAdapter(prisma),
    callbacks: {
        jwt({token, user}) {
            if (user) {
                token.id = user.id!;
            }
            return token;
        },
        session({session, token}) {
            // @ts-expect-error TS2322
            session.user.id = token.id;
            return session
        },
    },
    session: {
        strategy: "jwt"
    },
    providers: [Discord({
        // Do not request email scope, but do request guilds so we can check who is in the Dojo.
        authorization: "https://discord.com/api/oauth2/authorize?scope=identify+guilds",
    })]
})
