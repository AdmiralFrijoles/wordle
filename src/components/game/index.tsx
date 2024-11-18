"use client";

import {useEffect, useState} from "react";
import {GameStates, IUserPuzzleSolution, Row} from "@/types";
import Keyboard from "@/components/game/keyboard";
import isValidWord from "../../lib/dictionary";
import {REVEAL_TIME_MS} from "@/constants";
import toast from "react-hot-toast";
import GameGrid from "@/components/game/grid";
import {Puzzle, Solution} from "@prisma/client";

type Props = {
    puzzle: Puzzle;
    solution: Solution;
    initialUserSolution: IUserPuzzleSolution | null;
}

export default function GamePanel({solution, initialUserSolution}: Props) {
    const [userSolution, setUserSolution] = useState<IUserPuzzleSolution | null>(initialUserSolution);
    const [rows, setRows] = useState<Row[]>([]);
    const [currentRowIndex, setCurrentRowIndex] = useState(0);
    const [text, setText] = useState("");
    const [gameState, setGameState] = useState<keyof typeof GameStates>("Unsolved");
    const [isRevealing, setIsRevealing] = useState(false)
    const [toastId, setToastId] = useState<string | undefined>();

    const wordLength: number = solution.solution.length;
    const maxGuesses: number = solution.maxGuesses;

    function handleReset(){
        const temp: Row[] = [];
        for (let i = 0; i < maxGuesses; i++) {
            const tempRow: Row = [];
            for (let j = 0; j < wordLength; j++) {
                tempRow.push({
                    value: "",
                    status: "Guessing",
                });
            }
            temp.push(tempRow);
        }
        setRows(temp);
        setCurrentRowIndex(0);
    }
    
    function handleLetterClick(letter: string) {
        if (gameState !== "Unsolved") return;
        if (text.length >= wordLength) return;
        setText(text + letter);
    }

    function getStatuses() {
        const currentRow = rows[currentRowIndex];
        for (let i = 0; i < currentRow.length; i++) {
            if (solution.solution[i].toLocaleUpperCase() === text[i].toLocaleUpperCase())
                currentRow[i].status = "Correct";
            else if (solution.solution.toLocaleUpperCase().includes(text[i].toLocaleUpperCase()))
                currentRow[i].status = "Present";
            else
                currentRow[i].status = "Absent";
        }
        setRows([...rows]);
    }

    function handleSubmit() {
        function getGuesses() {
            return rows
                .slice(0, currentRowIndex)
                .map(row => row.flatMap(cell => cell.value).join());
        }

        if (gameState !== "Unsolved" || isRevealing) return;

        toast.remove(toastId);
        if (text.length !== wordLength) {
            setToastId(toast("Not enough letters", {
                duration: 1500,
                style: { background: "#f56565", color: "#fff"},
            }));
            return;
        }
        const isSolution = solution.solution.toLocaleUpperCase() === text.toLocaleUpperCase();
        if (!isValidWord(text) && !isSolution) {
            setToastId(toast("Not in word list", {
                duration: 1500,
                style: { background: "#f56565", color: "#fff"},
            }));
            return;
        }

        try {
            setIsRevealing(true)
            getStatuses();
            // turn this back off after all
            // chars have been revealed
            setTimeout(() => {
                setIsRevealing(false)
            }, REVEAL_TIME_MS * wordLength)

            if (isSolution) {
                setGameState("Win");
                setCurrentRowIndex(currentRowIndex + 1);
                return;
            }
            if (currentRowIndex === rows.length - 1) {
                setGameState("Loss");
                return;
            }
            setText("");
            setCurrentRowIndex(currentRowIndex + 1);
        }
        finally {
            setUserSolution({
                ...userSolution,
                guesses: getGuesses(),
                state: gameState
            } as IUserPuzzleSolution)
        }
    }

    function deleteChar() {
        if (gameState !== "Unsolved" || isRevealing) return;
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

    // useEffect on userSolution to save to db/local storage when updated

    return (
        <div className="mx-auto flex w-full grow flex-col px-1 pb-8 pt-2 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 short:pt-2">
            <GameGrid
                rows={rows}
                isRevealing={isRevealing}
                currentRowIndex={currentRowIndex}
            />
            <Keyboard
                onLetterClick={handleLetterClick}
                onSubmit={handleSubmit}
                rows={rows.slice(0, currentRowIndex)}
                onDelete={deleteChar}
                isRevealing={isRevealing}
            />
        </div>
    )
}