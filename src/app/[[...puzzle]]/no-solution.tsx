"use client";

import {Puzzle} from "@prisma/client";
import {CalendarDate} from "@internationalized/date";
import {useGlobalModal} from "@/providers/GlobalModalProvider";

type Props = {
    puzzle: Puzzle;
    date: CalendarDate;
}

export default function NoSolution({}: Props) {
    const puzzleModal = useGlobalModal("puzzles");

    return (
        <div className="glass mt-6 flex flex-col items-center gap-4 rounded-[22px] px-6 py-8 text-center">
            <h2 className="text-lg font-bold tracking-[-0.01em] text-fg sm:text-xl">This puzzle has no word today</h2>
            {puzzleModal &&
                <button type="button" onClick={puzzleModal.onOpen}
                        className="btn-primary h-[52px] cursor-pointer rounded-2xl px-6 text-base font-bold">
                    Choose another puzzle
                </button>}
        </div>
    )
}
