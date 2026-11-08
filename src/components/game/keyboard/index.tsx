import {Row} from "@/types";
import {useEffect} from "react";
import Key from "@/components/game/key";
import {BackspaceIcon} from "@/components/icons";
import {getKeyboardGuessStatuses} from "@/lib/guesses";

function isKeyForSomethingElse(e: KeyboardEvent): boolean {
    const target = e.target as HTMLElement | null;
    return e.ctrlKey || e.metaKey || e.altKey
        || !!target?.closest("input, textarea, select")
        || document.querySelector("[role='dialog']") !== null;
}

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
    disabled?: boolean | undefined;
};

export default function Keyboard({
                                     onLetterClick,
                                     onSubmit,
                                     onDelete,
                                     solution,
                                     rows,
                                     isRevealing,
                                     disabled,
}: Props) {
    const keyboardRowCount = keyboardLayout.length;
    const statuses = getKeyboardGuessStatuses(solution, isRevealing ? rows.slice(0, -1) : rows);

    useEffect(() => {
        function listener(e: KeyboardEvent) {
            if (isKeyForSomethingElse(e)) {
                return;
            }
            if (e.code === "Enter") {
                // Focus often sits on the button that opened the last sheet. Enter must submit, not reopen it.
                e.preventDefault();
                if (!e.repeat) {
                    onSubmit();
                }
            } else if (e.code === "Backspace") {
                onDelete();
            } else if (!e.repeat) {
                const key = e.key.toUpperCase();
                if (key.length === 1 && key >= "A" && key <= "Z") {
                    onLetterClick(key);
                }
            }
        }
        window.addEventListener("keydown", listener);
        return () => {
            window.removeEventListener("keydown", listener);
        };
    })

    return (
        <div role="group" aria-label="Keyboard" className="flex shrink-0 flex-col gap-2">

            {keyboardLayout.map((row, rowIndex) => (
            <div key={rowIndex}
                 className={rowIndex === 1 ? "flex gap-1.5 px-[4.5%]" : "flex gap-1.5"}>
                {(rowIndex === keyboardRowCount - 1) &&
                <Key value="ENTER" onClick={onSubmit} disabled={disabled} />}
                {row.map(key => (
                    <Key key={key}
                         disabled={disabled}
                         value={key}
                         onClick={onLetterClick}
                         status={statuses[key]}
                         isRevealing={isRevealing}/>
                ))}
                {(rowIndex === keyboardRowCount - 1) &&
                <Key value="DELETE" label="Delete" onClick={onDelete} disabled={disabled}>
                    <BackspaceIcon/>
                </Key>}
            </div>
            ))}
        </div>
    );
}

