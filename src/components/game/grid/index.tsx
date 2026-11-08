import {Row} from "@/types";
import GameGridCell from "@/components/game/cell";

type Props = {
    rows: Row[];
    isRevealing?: boolean;
    currentRowIndex: number;
    currentRowClassName: string;
    isLoading?: boolean | undefined;
    isPlaying?: boolean;
};

export default function GameGrid({rows, isRevealing, currentRowIndex, currentRowClassName, isLoading, isPlaying}: Props) {
    return (
        <div className="flex grow flex-col items-center justify-center gap-1.5 py-3 sm:gap-2 sm:py-0">
            {rows.map((play, rowIndex) => {
                const isCurrentRow = currentRowIndex === rowIndex;
                const activeIndex = isCurrentRow && isPlaying ? play.findIndex(cell => !cell.value) : -1;
                const classes = `flex gap-1.5 sm:gap-2 ${isCurrentRow ? currentRowClassName : ""}`;
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
                                isCompleted={play.every(c => c.status !== "Guessing")}
                            />
                        ))}
                    </div>
                );
                }
            )}
        </div>
    )
}
