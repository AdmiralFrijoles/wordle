import {UserCircleIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";
import { auth0 } from "@/lib/auth0"

export default async function CurrentUser() {
    const session = await auth0.getSession()

    if (!session) {
        return (
            <HeaderIcon tooltipContent="Sign In">
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/auth/login">
                    <UserCircleIcon className="dark:stroke-white"/>
                </a>
            </HeaderIcon>
        );
    }

    return (
        <HeaderIcon tooltipContent="Sign Out">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/auth/logout">
                {session.user.picture ?
                    <img className="rounded-full cursor-pointer animated"
                           src={session.user.picture}
                           alt={session.user.name ?? "user"}
                    /> :
                    <UserCircleIcon className="dark:stroke-white"/>
                }
            </a>
        </HeaderIcon>
    )
}