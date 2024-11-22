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
    return (
        <div className="my-2 flex justify-center">
            <StatItem label="Total tries" value={puzzleStats.totalGames} />
            <StatItem label="Success rate" value={puzzleStats.successRate} />
            <StatItem label="Current streak" value={puzzleStats.currentStreak} />
            <StatItem label="Best streak" value={puzzleStats.bestStreak} />
        </div>
    )
}