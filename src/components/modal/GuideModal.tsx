"use client";

import {InformationCircleIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";
import {useDisclosure} from "@nextui-org/use-disclosure";
import BaseModal from "@/components/modal/ModalBase";
import GameGridCell from "@/components/game/cell";


export default function GuideModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            <HeaderIcon tooltipContent="How To Play">
                <InformationCircleIcon className="dark:stroke-white" onClick={onOpen}/>
            </HeaderIcon>
            <BaseModal title="How To Play" isOpen={isOpen} onOpenChange={onOpenChange}>
                <div className="text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                        Guess the word in 6 tries. After each guess, the color of the tiles will
                        change to show how close your guess was to the word.
                    </p>

                    <div className="mb-1 mt-4 flex justify-center">
                        <GameGridCell
                            isRevealing={true}
                            isCompleted={true}
                            value="W"
                            status="Correct"
                        />
                        <GameGridCell value="E" isCompleted={true}/>
                        <GameGridCell value="A" isCompleted={true}/>
                        <GameGridCell value="R" isCompleted={true}/>
                        <GameGridCell value="Y" isCompleted={true}/>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                        The letter W is in the word and in the correct spot.
                    </p>

                    <div className="mb-1 mt-4 flex justify-center">
                        <GameGridCell value="P" isCompleted={true}/>
                        <GameGridCell value="I" isCompleted={true}/>
                        <GameGridCell
                            isRevealing={true}
                            isCompleted={true}
                            value="L"
                            status="Present"
                        />
                        <GameGridCell value="O" isCompleted={true}/>
                        <GameGridCell value="T" isCompleted={true}/>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                        The letter L is in the word but in the wrong spot.
                    </p>

                    <div className="mb-1 mt-4 flex justify-center">
                        <GameGridCell value="V" isCompleted={true}/>
                        <GameGridCell value="A" isCompleted={true}/>
                        <GameGridCell value="G" isCompleted={true}/>
                        <GameGridCell isRevealing={true} isCompleted={true} value="U" status="Absent"/>
                        <GameGridCell value="E" isCompleted={true}/>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                        The letter U is not in the word in any spot.
                    </p>
                </div>
            </BaseModal>
        </>
    )
}