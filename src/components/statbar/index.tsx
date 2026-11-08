"use client";

import classnames from "classnames";
import {PuzzleStats} from "@/types";

function StatItem({label, value, isHighlighted}: {label: string, value: string | number, isHighlighted?: boolean}) {
    return (
        <div className="flex flex-col items-center gap-1.5 px-1 text-center not-first:border-l not-first:border-line">
            <span className={classnames(
                "text-[28px] leading-none font-extrabold tracking-[-0.03em] tabular-nums",
                isHighlighted ? "text-[#16a34a] dark:text-[#4ade80] dark:[text-shadow:0_0_12px_rgb(74_222_128/0.22)]" : "text-fg"
            )}>
                {value}
            </span>
            <span className="text-xs leading-tight font-medium text-fg-sub">{label}</span>
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
        <div className="glass grid grid-cols-4 rounded-[22px] pt-[18px] pb-4">
            <StatItem label="Total games" value={numberFormat.format(puzzleStats.totalGames)} />
            <StatItem label="Success rate" value={percentFormat.format(puzzleStats.successRate)} />
            <StatItem label="Current streak" value={numberFormat.format(puzzleStats.currentStreak)}
                      isHighlighted={puzzleStats.currentStreak > 0} />
            <StatItem label="Best streak" value={numberFormat.format(puzzleStats.bestStreak)} />
        </div>
    )
}
