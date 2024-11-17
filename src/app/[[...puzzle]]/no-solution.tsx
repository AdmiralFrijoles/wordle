import {Puzzle} from "@prisma/client";
import {getPuzzleCount} from "@/lib/puzzle-service";
import {PuzzlePieceIcon} from "@heroicons/react/24/outline";

type Props = {
    puzzle: Puzzle;
    date: Date;
}

export default async function NoSolution({}: Props) {
    const numPublicPuzzles = await getPuzzleCount(true);

    return (
        <div className="flex flex-col items-center justify-center">
            <h2 className="text-sm sm:text-lg dark:text-white">This puzzle does not have a solution today.</h2>
            {numPublicPuzzles > 1 && <p>Use the <PuzzlePieceIcon className="inline-flex w-4 pb-0.5"/> menu to select another puzzle.</p>}
        </div>
    )
}
