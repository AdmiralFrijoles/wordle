import {UserIcon} from "@/components/icons";
import HeaderIcon from "@/components/header/HeaderIcon";
import {auth, signIn, signOut} from "@/lib/auth";
import UserModal from "@/components/modal/UserModal";
import {getCurrentUserProfile} from "@/lib/discord";
import {DiscordReauthRequiredError} from "@/lib/discord-errors";

export default async function CurrentUser() {
    const session = await auth();

    async function signOutUser() {
        "use server";
        await signOut({
            redirect: false,
        });
    }

    function renderSignIn(tooltip: string) {
        return (
            <form action={async () => {
                "use server";
                await signIn("discord");
            }}>
                <HeaderIcon label={tooltip} type="submit">
                    <UserIcon/>
                </HeaderIcon>
            </form>
        );
    }

    if (!session?.user) {
        return renderSignIn("Sign In");
    }

    try {
        const profile = await getCurrentUserProfile();
        return (
            <UserModal
                userImage={profile?.avatar ?? session.user.image}
                signOutAction={signOutUser}/>
        );
    } catch (e) {
        if (e instanceof DiscordReauthRequiredError) {
            return renderSignIn("Sign In Again");
        }
        throw e;
    }
}