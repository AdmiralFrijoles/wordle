"use client";

import {PuzzleStats} from "@/types";

function StatItem({label, value}: {label: string, value: string | number}) {
    return (
        <div className="m-1 w-1/4 items-center justify-center dark:text-white">
            <div className="text-3xl font-bold">{value}</div>
            <div className="text-xs">{label}</div>
        </div>
    )
}

type Props = {
    puzzleStats: PuzzleStats
}

export default function StatBar({puzzleStats}: Props) {
    const numberFormat = new Intl.NumberFormat();
    const percentFormat = new Intl.NumberFormat(undefined, {style: "percent"});
    return (
        <div className="my-2 flex justify-center text-center">
            <StatItem label="Total games" value={numberFormat.format(puzzleStats.totalGames)} />
            <StatItem label="Success rate" value={percentFormat.format(puzzleStats.successRate)} />
            <StatItem label="Current streak" value={numberFormat.format(puzzleStats.currentStreak)} />
            <StatItem label="Best streak" value={numberFormat.format(puzzleStats.bestStreak)} />
        </div>
    )
}