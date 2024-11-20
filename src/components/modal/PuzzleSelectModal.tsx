"use client";

import {PuzzlePieceIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";
import BaseModal from "@/components/modal/ModalBase";
import {useDisclosure} from "@nextui-org/use-disclosure";

export default function PuzzleSelectModal({hasMultiplePuzzles}: { hasMultiplePuzzles: boolean}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    if (!hasMultiplePuzzles) return null;

    return (
        <>
            <HeaderIcon tooltipContent="Choose Puzzle">
                <PuzzlePieceIcon className="dark:stroke-white" onClick={onOpen}/>
            </HeaderIcon>

            <BaseModal title="Available Puzzles" isOpen={isOpen} onOpenChange={onOpenChange}>
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                        TODO: This is where the list of available puzzles will go.
                    </p>
                </div>
            </BaseModal>
        </>
    )
}