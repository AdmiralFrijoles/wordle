import {Row} from "@/types";
import GameGridCell from "@/components/game/cell";

type Props = {
    rows: Row[];
    isRevealing?: boolean;
    currentRowIndex: number;
    currentRowClassName: string;
    isLoading?: boolean | undefined;
};

export default function GameGrid({rows, isRevealing, currentRowIndex, currentRowClassName, isLoading}: Props) {
    return (
        <div className="flex grow flex-col justify-center pb-6 short:pb-2">
            {rows.map((play, rowIndex) => {
                const classes = `flex justify-center mb-1 ${currentRowIndex === rowIndex ? currentRowClassName : ""}`;
                return (
                    <div key={rowIndex} className={classes}>
                        {play.map((guess, idx) => (
                            <GameGridCell
                                key={idx}
                                isLoading={isLoading}
                                value={guess.value}
                                status={guess.status}
                                position={idx}
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