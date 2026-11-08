"use client";

import HeaderIcon from "@/components/header/HeaderIcon";
import {useDisclosure} from "@heroui/react";
import BaseModal from "@/components/modal/ModalBase";
import GameGridCell from "@/components/game/cell";
import {HelpIcon} from "@/components/icons";


export default function GuideModal() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    return (
        <>
            <HeaderIcon label="How To Play" onPress={onOpen}>
                <HelpIcon/>
            </HeaderIcon>
            <BaseModal title="How To Play" isOpen={isOpen} onOpenChange={onOpenChange}>
                <div className="flex flex-col gap-5 text-sm leading-relaxed text-fg-sub">
                    <p>
                        Guess the word in 6 tries. After each guess, the color of the tiles will
                        change to show how close your guess was to the word.
                    </p>

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-1.5">
                            <GameGridCell size="small" isRevealing={true} isCompleted={true} value="W" status="Correct"/>
                            <GameGridCell size="small" value="E" isCompleted={true}/>
                            <GameGridCell size="small" value="A" isCompleted={true}/>
                            <GameGridCell size="small" value="R" isCompleted={true}/>
                            <GameGridCell size="small" value="Y" isCompleted={true}/>
                        </div>
                        <p>The letter W is in the word and in the correct spot.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-1.5">
                            <GameGridCell size="small" value="P" isCompleted={true}/>
                            <GameGridCell size="small" value="I" isCompleted={true}/>
                            <GameGridCell size="small" isRevealing={true} isCompleted={true} value="L" status="Present"/>
                            <GameGridCell size="small" value="O" isCompleted={true}/>
                            <GameGridCell size="small" value="T" isCompleted={true}/>
                        </div>
                        <p>The letter L is in the word but in the wrong spot.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-1.5">
                            <GameGridCell size="small" value="V" isCompleted={true}/>
                            <GameGridCell size="small" value="A" isCompleted={true}/>
                            <GameGridCell size="small" value="G" isCompleted={true}/>
                            <GameGridCell size="small" isRevealing={true} isCompleted={true} value="U" status="Absent"/>
                            <GameGridCell size="small" value="E" isCompleted={true}/>
                        </div>
                        <p>The letter U is not in the word in any spot.</p>
                    </div>
                </div>
            </BaseModal>
        </>
    )
}
