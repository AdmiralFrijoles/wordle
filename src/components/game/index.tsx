"use client";

import {useEffect, useState} from "react";
import {GameStates, Row} from "@/types";
import Keyboard from "@/components/game/keyboard";
import isValidWord from "../../lib/dictionary";

export default function GamePanel() {
    const [rows, setRows] = useState<Row[]>([]);
    const [currentRowIndex, setCurrentRowIndex] = useState(0);
    const [text, setText] = useState("");
    const [solution, setSolution] = useState("");
    const [gameState, setGameState] = useState<keyof typeof GameStates>("Playing");

    function setRowIndex(index: number) {
        setCurrentRowIndex(Math.min(Math.max(index, 0), rows.length - 1));
    }

    function handleReset(){
        const temp: Row[] = [];
        for (let i = 0; i < 6; i++) {
            const row: Row = [
                {
                    value: "",
                    status: "Guessing",
                },
                {
                    value: "",
                    status: "Guessing",
                },
                {
                    value: "",
                    status: "Guessing",
                },
                {
                    value: "",
                    status: "Guessing",
                },
                {
                    value: "",
                    status: "Guessing",
                },
            ];
            temp.push(row);
        }
        setRows(temp);
        setCurrentRowIndex(0);
        //setSolution(loadSolution());
    }
    
    function handleLetterClick(letter: string) {
        if (text.length > 4) return;
        setText(text + letter);
    }

    function getStatuses() {
        const currentRow = rows[currentRowIndex];
        for (let i = 0; i < currentRow.length; i++) {
            if (solution[i] === text[i].toLocaleUpperCase())
                currentRow[i].status = "Correct";
            else if (solution.includes(text[i].toLocaleUpperCase()))
                currentRow[i].status = "Present";
            else
                currentRow[i].status = "Absent";
        }
        setRows([...rows]);
    }

    function handleSubmit() {
        if (text.length !== 5) {
            // TODO: show toast with error
            return;
        }
        if (!isValidWord(text)) {
            // TODO: show toast with error
            return;
        }
        getStatuses();
        if (text === solution.toUpperCase()) {
            setGameState("Win");
            return;
        }
        if (currentRowIndex === rows.length - 1) {
            setGameState("Lose");
            return;
        }
        setText("");
        setRowIndex(currentRowIndex + 1);
    }

    function deleteChar() {
        setText((prev) => text.substring(0, prev.length - 1));
    }

    useEffect(() => {
        handleReset();
    }, []);

    useEffect(() => {
        if (rows.length === 0) return;
        const currentRow = rows[currentRowIndex];
        for (let i = 0; i < currentRow.length; i++) {
            if (i < text.length) {
                currentRow[i].value = text[i];
            } else {
                currentRow[i].value = "";
            }
        }
        setRows([...rows]);
    }, [text]);

    return (
        <div className="mx-auto flex w-full grow flex-col px-1 pb-8 pt-2 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
            <div className="flex grow flex-col justify-center pb-6 short:pb-2">
                {rows.map((play, index) => (
                    <div key={index} className="mb-1 flex justify-center">
                        {play.map((guess, idx) => (
                            <p key={idx}>{guess.value}</p>
                        ))}
                    </div>
                ))}
            </div>
            <Keyboard
                onLetterClick={handleLetterClick}
                onSubmit={handleSubmit}
                rows={rows.slice(0, currentRowIndex)}
                onDelete={deleteChar}
            />
        </div>
    )
}