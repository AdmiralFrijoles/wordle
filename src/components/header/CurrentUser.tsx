"use client";

import {UserCircleIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";
import {useUser} from "@auth0/nextjs-auth0"

export default function CurrentUser() {
    const {user} = useUser();

    if (!user) {
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
                {user.picture ?
                    <img className="rounded-full cursor-pointer animated"
                           src={user.picture}
                           alt={user.name ?? "user"}
                    /> :
                    <UserCircleIcon className="dark:stroke-white"/>
                }
            </a>
        </HeaderIcon>
    )
}