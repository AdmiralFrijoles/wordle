﻿"use client";

import {useDisclosure} from "@nextui-org/use-disclosure";
import HeaderIcon from "@/components/header/HeaderIcon";
import {UserCircleIcon} from "@heroicons/react/24/outline";
import BaseModal from "@/components/modal/ModalBase";
import {useSession} from "next-auth/react";

type Props = {
    signOutAction: () => void;
}

export default function UserModal({signOutAction}: Props) {
    const {data: session, status: sessionStatus} = useSession();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            {sessionStatus === "loading" && (
                <UserCircleIcon className="dark:stroke-white w-6 h-6"/>
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
                        <form action={signOutAction}>
                            <button type="submit" className="flex w-full justify-center items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base">
                                Sign Out
                            </button>
                        </form>
                    </BaseModal>
                </>
            )}
        </>
    )
}