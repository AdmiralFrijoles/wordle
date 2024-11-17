"use client";

import {Puzzle, Solution} from "@prisma/client";
import GamePanel from "@/components/game";

type Props = {
    puzzle: Puzzle;
    solution: Solution;
}

export default function PuzzlePage({puzzle, solution}: Props) {
    return (
        <GamePanel puzzle={puzzle} solution={solution} />
    );
}