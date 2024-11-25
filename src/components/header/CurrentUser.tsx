﻿import {UserCircleIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";
import {auth, signIn, signOut} from "@/lib/auth";
import {Avatar} from "@nextui-org/react";
import UserModal from "@/components/modal/UserModal";

export default async function CurrentUser() {
    const session = await auth();

    async function signOutUser() {
        "use server";
        await signOut();
    }

    if (!session?.user) {
        return (
            <form action={async () => {
                "use server";
                await signIn("discord");
            }}>
                <HeaderIcon tooltipContent="Sign In">
                    <button type="submit">
                        <Avatar
                            icon={<UserCircleIcon className="dark:stroke-white w-6 h-6"/>}
                            className="bg-transparent w-6 h-6"
                        />
                    </button>
                 </HeaderIcon>
            </form>
    )
    } else {
        return (
            <UserModal signOutAction={signOutUser}/>
        )
    }
}