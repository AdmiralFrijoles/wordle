import {Row} from "@/types";
import {useEffect} from "react";
import Key from "@/components/game/key";
import {BackspaceIcon} from "@heroicons/react/24/outline";
import {getKeyboardGuessStatuses} from "@/lib/guesses";

const keyboardLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M",]
];

type Props = {
    onLetterClick: (letter: string) => void;
    onSubmit: () => void;
    onDelete: () => void;
    solution: string;
    rows: Row[];
    isRevealing?: boolean;
};

export default function Keyboard({
                                     onLetterClick,
                                     onSubmit,
                                     onDelete,
                                     solution,
                                     rows,
                                     isRevealing
}: Props) {
    const keyboardRowCount = keyboardLayout.length;
    const statuses = getKeyboardGuessStatuses(solution, rows);

    useEffect(() => {
        function listener(e: KeyboardEvent) {
            if (e.code === "Enter") {
                onSubmit();
            } else if (e.code === "Backspace") {
                onDelete();
            } else {
                const key = e.key.toUpperCase();
                if (key.length === 1 && key >= "A" && key <= "Z")
                    onLetterClick(key);
            }
        }
        window.addEventListener("keyup", listener);
        return () => {
            window.removeEventListener("keyup", listener);
        };
    })

    return (
        <div>
            {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex}
                 className={rowIndex < keyboardRowCount - 1 ? "mb-1 flex justify-center" : "flex justify-center"}>
                {(rowIndex === keyboardRowCount - 1) &&
                <Key value="ENTER" onClick={onSubmit} />}
                {row.map(key => (
                    <Key key={key}
                         value={key}
                         onClick={onLetterClick}
                         status={statuses[key]}
                         isRevealing={isRevealing}/>
                ))}
                {(rowIndex === keyboardRowCount - 1) &&
                <Key value="DELETE" onClick={onDelete}>
                    <BackspaceIcon className="h-[1.25rem] w-[1.3rem] mt-[0.1rem] stroke-2"/>
                </Key>}
            </div>
            ))}
        </div>
    );
}

