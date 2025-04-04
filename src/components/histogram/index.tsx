﻿import {PuzzleStats} from "@/types";
import Progress from "@/components/progress";


type Props = {
    puzzleStats: PuzzleStats
    isLatestGame: boolean
    isGameWon: boolean
    numberOfGuessesMade: number
}

function isCurrentDayStatRow(
    isLatestGame: boolean,
    isGameWon: boolean,
    numberOfGuessesMade: number,
    i: number
) {
    return isLatestGame && isGameWon && numberOfGuessesMade === i + 1
}

export default function Histogram({puzzleStats, isLatestGame, isGameWon, numberOfGuessesMade}: Props) {
    const winDistribution = puzzleStats.winDistribution
    const maxValue = Math.max(...winDistribution, 1)

    return (
        <div className="justify-left m-2 columns-1 text-sm dark:text-white">
            {winDistribution.map((value, i) => (
                <Progress
                    key={i}
                    index={i}
                    isCurrentDayStatRow={isCurrentDayStatRow(
                        isLatestGame,
                        isGameWon,
                        numberOfGuessesMade,
                        i
                    )}
                    size={90 * (value / maxValue)}
                    label={String(value)}
                />
            ))}
        </div>
    )
}