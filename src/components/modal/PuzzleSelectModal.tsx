"use client";

import BaseModal from "@/components/modal/ModalBase";
import {useDisclosure, Skeleton} from "@heroui/react";
import {useAsync} from "react-use";
import {listPuzzlesForUser} from "@/lib/puzzle-service";
import {useState} from "react";
import {Puzzle} from "@prisma/client";
import {useCurrentPuzzle} from "@/providers/PuzzleProvider";
import Link from "next/link";
import {useGlobalModal} from "@/providers/GlobalModalProvider";
import {ChevronRightIcon} from "@/components/icons";

const iconStyles = [
    "hit-correct [--hit-glow:0]",
    "hit-present [--hit-glow:0]",
    "tile-absent",
];

export default function PuzzleSelectModal({hasMultiplePuzzles}: { hasMultiplePuzzles: boolean}) {
    const disclosure = useDisclosure();
    useGlobalModal("puzzles", hasMultiplePuzzles ? disclosure : undefined);
    const {isOpen, onClose, onOpenChange} = disclosure;
    const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
    const [isLoadingPuzzles, setIsLoadingPuzzles] = useState(true);
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

    if (!hasMultiplePuzzles) {
        return null;
    }

    return (
        <BaseModal title="Available Puzzles" isOpen={isOpen} onOpenChange={onOpenChange}>
            <nav aria-label="Puzzles" className="flex flex-col gap-2.5">
                {isLoadingPuzzles ?
                    [0, 1, 2].map(i => <Skeleton key={i} className="skeleton h-[68px] rounded-[18px]"/>) :
                    puzzles
                        .filter(puzzle => puzzle.id !== currentPuzzle?.id)
                        .map((puzzle, idx) => (
                            <Link key={puzzle.id} href={`/${puzzle.slug}`} onClick={onClose}
                                  className="glass flex min-h-16 items-center gap-3.5 rounded-[18px] py-3.5 pr-3 pl-4 text-fg">
                                <span aria-hidden="true"
                                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[17px] font-extrabold ${iconStyles[idx % iconStyles.length]}`}>
                                    {puzzle.title.trim().charAt(0).toUpperCase()}
                                </span>
                                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                    <span className="text-base font-semibold">{puzzle.title}</span>
                                    {puzzle.description &&
                                        <span className="text-[13px] leading-snug text-fg-sub">{puzzle.description}</span>}
                                </span>
                                <ChevronRightIcon size={18} className="shrink-0 text-fg-muted"/>
                            </Link>
                        ))}
            </nav>
        </BaseModal>
    )
}
