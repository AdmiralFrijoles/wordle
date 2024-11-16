import {Row} from "@/types";
import GameGridCell from "@/components/game/cell";

type Props = {
    rows: Row[];
    isRevealing?: boolean;
    currentRowIndex: number;
};

export default function GameGrid({rows, isRevealing, currentRowIndex}: Props) {
    return (
        <div className="flex grow flex-col justify-center pb-6 short:pb-2">
            {rows.map((play, rowIndex) => (
                <div key={rowIndex} className="mb-1 flex justify-center">
                    {play.map((guess, idx) => (
                        <GameGridCell
                            key={idx}
                            value={guess.value}
                            status={guess.status}
                            position={idx}
                            isRevealing={isRevealing && rowIndex === currentRowIndex - 1}
                            isCompleted={play.every(c => c.status !== "Guessing")}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}