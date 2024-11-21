"use client";

import {PuzzlePieceIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";
import BaseModal from "@/components/modal/ModalBase";
import {useDisclosure} from "@nextui-org/use-disclosure";
import {useAsync} from "react-use";
import {listPuzzlesForUser} from "@/lib/puzzle-service";
import {useState} from "react";
import {Puzzle} from "@prisma/client";
import {Card, CardBody, CardHeader} from "@nextui-org/react";
import {useCurrentPuzzle} from "@/providers/PuzzleProvider";
import Link from "next/link";

export default function PuzzleSelectModal({hasMultiplePuzzles}: { hasMultiplePuzzles: boolean}) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
    const [isLoadingPuzzles, setIsLoadingPuzzles] = useState(false);
    const {currentPuzzle} = useCurrentPuzzle();

    useAsync(async () => {
        if (isOpen) {
            setIsLoadingPuzzles(true);
            const puzzles = await listPuzzlesForUser();
            setPuzzles(puzzles);
            setIsLoadingPuzzles(false);
        } else {
            setPuzzles([]);
        }
    }, [isOpen])

    if (!hasMultiplePuzzles) return null;

    return (
        <>
            <HeaderIcon tooltipContent="Choose Puzzle">
                <PuzzlePieceIcon className="dark:stroke-white" onClick={onOpen}/>
            </HeaderIcon>

            <BaseModal title="Available Puzzles" isOpen={isOpen} onOpenChange={onOpenChange}>
                <div className="text-center">
                    {isLoadingPuzzles ?? <p className="text-sm text-gray-500 dark:text-gray-300">
                        Loading Puzzles...
                    </p>}
                </div>

                <div className="grid grid-flow-row-dense grid-cols-1 gap-2">
                    {puzzles
                        .filter(puzzle => puzzle.id !== currentPuzzle?.id)
                        .map((puzzle, idx) => (
                        <Link key={idx} href={`/${puzzle.slug}`} className="p-0 m-0">
                            <Card
                                className="bg-transparent shadow-none rounded border-2 border-solid
                                hover:bg-slate-100 active:bg-slate-200 bg-slate-200
                                hover:dark:bg-slate-700 dark:bg-slate-600 border-slate-200 dark:border-slate-600"
                            >
                                <CardHeader className="justify-start py-2">
                                    <h4 className="font-bold text-medium">{puzzle.title}</h4>
                                </CardHeader>
                                {puzzle.description &&
                                <CardBody className="pt-0">
                                    <p className="text-sm">{puzzle.description}</p>
                                </CardBody>}
                            </Card>
                        </Link>
                    ))}
                </div>
            </BaseModal>
        </>
    )
}