"use client";

import {CalendarDaysIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";
import {useCurrentPuzzle} from "@/providers/PuzzleProvider";
import {useState} from "react";
import BaseModal from "@/components/modal/ModalBase";
import {useDisclosure} from "@nextui-org/use-disclosure";

export default function ArchiveModal() {
    const {currentPuzzle, currentSolution} = useCurrentPuzzle();
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();

    useState(() => {
        if (!currentPuzzle || !currentSolution)
            onClose();
    }, [currentPuzzle, currentSolution, onClose]);

    return (
        <>
            {currentPuzzle && (
                <>
                    <HeaderIcon tooltipContent="Play Previous Words">
                        <CalendarDaysIcon className="dark:stroke-white" onClick={onOpen}/>
                    </HeaderIcon>

                    <BaseModal title="Choose Solution Date" isOpen={isOpen} onOpenChange={onOpenChange}>
                        <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                TODO: This is where the date picker will go so that th user may select a previous solution to the current puzzle.
                            </p>
                        </div>
                    </BaseModal>
                </>
            )}
        </>
    )
}