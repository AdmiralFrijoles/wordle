import {UserCircleIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";
import {auth, signIn, signOut} from "@/lib/auth";

export default async function CurrentUser() {
    const session = await auth();

    if (!session?.user) {
        return (
            <HeaderIcon tooltipContent="Sign In">
                <form action={async () => {
                    "use server";
                    await signIn("discord");
                }}>
                    <button type="submit" className="w-full h-full">
                        <UserCircleIcon className="dark:stroke-white"/>
                    </button>
                </form>
            </HeaderIcon>
        );
    }

    return (
        <HeaderIcon tooltipContent="Sign Out">
            <form action={async () => {
                "use server";
                await signOut();
            }}>
                <button type="submit" className="w-full h-full">
                    {session.user.image ?
                        <img className="rounded-full cursor-pointer animated"
                             src={session.user.image}
                             alt={session.user.name ?? "user"}
                        /> :
                        <UserCircleIcon className="dark:stroke-white"/>
                    }
                </button>
            </form>
        </HeaderIcon>
    )
}