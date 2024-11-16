import {CharStatus, Row} from "@/types";
import {useEffect, useMemo} from "react";
import Key from "@/components/game/key";

const keyboardLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M",]
];

type Props = {
    onLetterClick: (letter: string) => void;
    onSubmit: () => void;
    onDelete: () => void;
    rows: Row[];
    isRevealing?: boolean;
};

export default function Keyboard({
                                     onLetterClick,
                                     onSubmit,
                                     onDelete,
                                     rows,
                                     isRevealing
}: Props) {
    const cells = useMemo(() => rows.flat(), [rows]);
    const keyboardRowCount = keyboardLayout.length;
    const checkStatus = (key: string) => {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].value === key && cells[i].status === "Absent")
                return "Absent" as CharStatus;
        }
        return "Guessing" as CharStatus;
    };

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
                <Key width={65.4} value="ENTER" onClick={onSubmit}>
                    ENTER
                </Key>}
                {row.map(key => (
                    <Key key={key}
                         value={key}
                         onClick={onLetterClick}
                         status={checkStatus(key)}
                         isRevealing={isRevealing}/>
                ))}
                {(rowIndex === keyboardRowCount - 1) &&
                <Key width={65.4} value="DELETE" onClick={onDelete}>
                    DELETE
                </Key>}
            </div>
            ))}
        </div>
    );
}

