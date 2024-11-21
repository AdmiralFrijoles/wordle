"use client";

import {ChartBarIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";
import BaseModal from "@/components/modal/ModalBase";
import {useDisclosure} from "@nextui-org/use-disclosure";

export default function RankingModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            <HeaderIcon tooltipContent="Stats & Ranking">
                <ChartBarIcon className="dark:stroke-white" onClick={onOpen}/>
            </HeaderIcon>

            <BaseModal title="Statistics" isOpen={isOpen} onOpenChange={onOpenChange}>
                <p>TODO</p>
            </BaseModal>
        </>
    )
}