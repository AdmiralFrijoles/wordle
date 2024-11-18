import { Auth0Client } from "@auth0/nextjs-auth0/server"
import {getOrCreateUser} from "@/lib/user-service";

export const auth0 = new Auth0Client({
    beforeSessionSaved: async (session) => {
        const externalId = session.user.sub;
        const username = (session.user.email ?? session.user.name) ?? session.user.sub;
        const profilePicture = session.user.picture;
        const displayName = session.user.nickname;

        const wordleUser = await getOrCreateUser(externalId, username, profilePicture, displayName);

        return {
            ...session,
            user: {
                ...session.user,
                userId: wordleUser.id,
                profilePicture: wordleUser.profile?.picture,
                displayName: wordleUser.profile?.displayName
            }
        }
    },
})