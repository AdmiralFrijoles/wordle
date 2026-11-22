import classnames from "classnames";
import {Row} from "@/types";
import GameGridCell from "@/components/game/cell";
import type {CSSProperties} from "react";

export type Celebration = "win" | "loss" | "loss-out" | null;

type Props = {
    rows: Row[];
    isRevealing?: boolean;
    currentRowIndex: number;
    currentRowClassName: string;
    isLoading?: boolean | undefined;
    isPlaying?: boolean;
    celebration?: Celebration;
    answer?: string;
};

export default function GameGrid({rows, isRevealing, currentRowIndex, currentRowClassName, isLoading, isPlaying, celebration, answer}: Props) {
    const isLossShown = (celebration === "loss" || celebration === "loss-out") && !!answer;
    const gridSize = {"--rows": rows.length, "--cols": rows[0]?.length ?? 5} as CSSProperties;

    return (
        <div style={gridSize} className="tile-grid relative flex grow flex-col items-center justify-center">
            <div className={classnames("flex flex-col gap-[var(--tile-gap)]", {
                "loss-sink": celebration === "loss",
                "loss-restore": celebration === "loss-out",
            })}>
                {rows.map((play, rowIndex) => {
                    const isCurrentRow = currentRowIndex === rowIndex;
                    const activeIndex = isCurrentRow && isPlaying ? play.findIndex(cell => !cell.value) : -1;
                    const classes = `flex gap-[var(--tile-gap)] ${isCurrentRow ? currentRowClassName : ""}`;
                    return (
                        <div key={rowIndex} className={classes}>
                            {play.map((guess, idx) => (
                                <GameGridCell
                                    key={idx}
                                    isLoading={isLoading}
                                    value={guess.value}
                                    status={guess.status}
                                    position={idx}
                                    isActive={idx === activeIndex}
                                    isRevealing={isRevealing && rowIndex === currentRowIndex - 1}
                                    isCelebrating={celebration === "win" && rowIndex === currentRowIndex - 1}
                                    isCompleted={play.every(c => c.status !== "Guessing")}
                                />
                            ))}
                        </div>
                    );
                })}
            </div>
            {isLossShown &&
                <div aria-hidden="true" className={classnames(
                    "prevent-select pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3.5",
                    {"loss-fade": celebration === "loss-out"}
                )}>
                    <span className="loss-label text-xs font-bold tracking-[0.08em] text-fg-icon uppercase">The word was</span>
                    <div className="flex gap-1.5">
                        {answer.toUpperCase().split("").map((letter, i) => (
                            <span key={i} style={{animationDelay: `${450 + i * 90}ms`}}
                                  className="loss-rise tile-reveal inline-flex h-12 w-11 items-center justify-center rounded-[11px] text-[22px] font-extrabold">
                                {letter}
                            </span>
                        ))}
                    </div>
                </div>}
        </div>
    )
}
