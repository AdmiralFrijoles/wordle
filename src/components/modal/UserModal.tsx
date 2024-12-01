﻿"use client";

import {useDisclosure} from "@nextui-org/use-disclosure";
import HeaderIcon from "@/components/header/HeaderIcon";
import {UserCircleIcon} from "@heroicons/react/24/outline";
import BaseModal from "@/components/modal/ModalBase";
import {useSession} from "next-auth/react";
import {Button} from "@nextui-org/react";

type Props = {
    signOutAction: () => Promise<void>;
    userImage: string | null | undefined;
}

export default function UserModal({signOutAction, userImage}: Props) {
    const {data: session, status: sessionStatus} = useSession();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    async function signOut() {
        await signOutAction();
        window.location.reload();
    }

    return (
        <>
            {sessionStatus === "loading" && (
                <div className="w-6 h-6" onClick={onOpen}>
                    {userImage ?
                        <img className="w-6 h-6 rounded-full" src={userImage} alt="User"/> :
                        <UserCircleIcon className="dark:stroke-white w-6 h-6"/>}
                </div>
                )}
            {sessionStatus === "authenticated" && session && (
                <>
                    <HeaderIcon tooltipContent="User Menu">
                        <div className="w-6 h-6" onClick={onOpen}>
                            {session?.user?.image ?
                                <img className="w-6 h-6 rounded-full" src={session.user.image} alt={session.user.name ?? "User"}/> :
                                <UserCircleIcon className="dark:stroke-white w-6 h-6"/>}
                        </div>
                    </HeaderIcon>
                    <BaseModal title="User" isOpen={isOpen} onOpenChange={onOpenChange}>
                        <h2 className="flex w-full justify-center">Welcome, {session.user.name}</h2>
                        <hr className="mt-4 mb-4 border-gray-500"/>
                        <form action={signOut}>
                            <Button
                                type="submit"
                                className="flex w-full justify-center items-center rounded-md p-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                Sign Out
                            </Button>
                        </form>
                    </BaseModal>
                </>
            )}
        </>
    )
}