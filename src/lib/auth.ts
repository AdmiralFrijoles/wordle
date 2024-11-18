import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import {PrismaAdapter} from "@auth/prisma-adapter"
import {prisma} from "@/lib/prisma"

export const {handlers, signIn, signOut, auth} = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt"
    },
    providers: [Discord({
        // Do not request email scope
        authorization: "https://discord.com/api/oauth2/authorize?scope=identify"
    })]
})
