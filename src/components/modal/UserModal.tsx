"use client";

import {useDisclosure, Image} from "@heroui/react";
import HeaderIcon from "@/components/header/HeaderIcon";
import BaseModal from "@/components/modal/ModalBase";
import {useSession} from "next-auth/react";
import {useDiscordGuild} from "@/providers/DiscordGuildProvider";
import {UserIcon} from "@/components/icons";

type Props = {
    signOutAction: () => Promise<void>;
    userImage: string | null | undefined;
}

function Avatar({src, alt}: { src: string | null | undefined, alt: string }) {
    if (!src) {
        return <UserIcon/>;
    }
    return <Image className="h-7 w-7 rounded-full" src={src} alt={alt} width="28" height="28" removeWrapper={true}/>;
}

export default function UserModal({signOutAction, userImage}: Props) {
    const {data: session, status: sessionStatus} = useSession();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {guild} = useDiscordGuild();

    async function signOut() {
        await signOutAction();
        window.location.reload();
    }

    if (sessionStatus === "loading") {
        return (
            <span className="flex h-11 w-11 items-center justify-center text-fg-icon">
                <Avatar src={userImage} alt=""/>
            </span>
        );
    }

    if (sessionStatus !== "authenticated" || !session) {
        return null;
    }

    return (
        <>
            <HeaderIcon label="Account" onPress={onOpen}>
                <Avatar src={userImage} alt=""/>
            </HeaderIcon>
            <BaseModal title="Account" isOpen={isOpen} onOpenChange={onOpenChange}>
                <div className="glass flex items-center gap-3.5 rounded-[18px] px-4 py-3.5">
                    {userImage &&
                        <Image className="h-11 w-11 rounded-full" src={userImage} alt="" width="44" height="44"
                               removeWrapper={true}/>}
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="truncate text-base font-semibold text-fg">{session.user.name}</span>
                        {guild &&
                            <span className="truncate text-[13px] text-fg-sub">Member of {guild.name}</span>}
                    </div>
                </div>
                <form action={signOut}>
                    <button type="submit"
                            className="btn-primary h-[52px] w-full cursor-pointer rounded-2xl text-base font-bold">
                        Sign Out
                    </button>
                </form>
            </BaseModal>
        </>
    )
}
