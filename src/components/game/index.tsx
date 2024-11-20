"use client";

import {useEffect, useRef, useState} from "react";
import {GameStates, IUserPuzzleSolution, Row} from "@/types";
import Keyboard from "@/components/game/keyboard";
import isValidWord from "../../lib/dictionary";
import {REVEAL_TIME_MS} from "@/constants";
import GameGrid from "@/components/game/grid";
import {Puzzle, Solution} from "@prisma/client";
import {useDebounce, useEffectOnce, useUpdateEffect} from "react-use";
import {alertError, clearAlert} from "@/lib/alerts";
import {upsertUserSolution} from "@/lib/user-service";
import {useSettings} from "@/providers/SettingsProvider";
import {useCurrentPuzzle} from "@/providers/PuzzleProvider";

type Props = {
    puzzle: Puzzle;
    solution: Solution;
    initialUserSolution: IUserPuzzleSolution;
}

export default function GamePanel({puzzle, solution, initialUserSolution}: Props) {
    const {setCurrentPuzzle, setCurrentSolution} = useCurrentPuzzle();
    const settings = useSettings();
    const [userSolution, setUserSolution] = useState<IUserPuzzleSolution>(initialUserSolution);
    const [userSolutionLoading, setUserSolutionLoading] = useState(false);
    const [loadedSolved, setLoadedSolved] = useState(false);
    const [rows, setRows] = useState<Row[]>([]);
    const [currentRowIndex, setCurrentRowIndex] = useState(0);
    const [text, setText] = useState("");
    const [gameState, setGameState] = useState<keyof typeof GameStates>("Unsolved");
    const [isRevealing, setIsRevealing] = useState(false)
    const [alertId, setAlertId] = useState<string | undefined>();
    const timer = useRef<NodeJS.Timeout>();

    const wordLength: number = solution.solution.length;
    const maxGuesses: number = solution.maxGuesses;

    useEffect(() => {
        setCurrentPuzzle(puzzle);
        setCurrentSolution(solution);
    }, [setCurrentPuzzle, setCurrentSolution, puzzle, solution]);

    function initRows() {
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
        return temp;
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
        if (gameState !== "Unsolved") return;

        clearAlert(alertId);
        if (text.length !== wordLength) {
            setAlertId(alertError("Not enough letters", 1500));
            return;
        }
        const isSolution = solution.solution.toLocaleUpperCase() === text.toLocaleUpperCase();
        if (!isValidWord(text) && !isSolution) {
            setAlertId(alertError("Not in word list", 1500));
            return;
        }

        setIsRevealing(true)
        getStatuses();
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            setIsRevealing(false)
        }, REVEAL_TIME_MS * wordLength);

        if (isSolution) {
            setGameState("Win");
        } else if (currentRowIndex === rows.length - 1) {
            setGameState("Loss");
        } else {
            setText("");
        }
        setCurrentRowIndex(currentRowIndex + 1);

        return () => clearTimeout(timer.current);
    }

    function deleteChar() {
        if (gameState !== "Unsolved") return;
        setText((prev) => text.substring(0, prev.length - 1));
    }

    useEffectOnce(() => {
        setUserSolutionLoading(true);
        if (!userSolution.userId) {
            const localStorageValue = localStorage.getItem(`user-solution-${initialUserSolution.solutionId}`);
            if (localStorageValue) {
                try {
                    const localUserSolution = JSON.parse(localStorageValue) as IUserPuzzleSolution;
                    setUserSolution(localUserSolution);
                } catch (e) {
                    console.error("Failed to load solution from local storage:", e);
                }
            }
        }
    });

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

    useDebounce(() => {
        // Don't save state if the user hasn't started playing.
        if (currentRowIndex <= 0) return;

        function getGuesses() {
            return rows
                .slice(0, currentRowIndex)
                .map(row => row.flatMap(cell => cell.value).join(""));
        }

        setUserSolution({
            ...userSolution,
            guesses: getGuesses(),
            state: gameState
        } as IUserPuzzleSolution)
    }, 100, [gameState, currentRowIndex]);

    useUpdateEffect(() => {
        async function saveUserSolution() {
            // Don't save state if the user hasn't started playing.
            if (userSolutionLoading || !userSolution || currentRowIndex <= 0) return;

            // If the solution is already solved, no need to save.
            if (loadedSolved) return;

            if (userSolution.userId) {
                console.log("SAVE USER SOLUTION: DB", userSolution);
                await upsertUserSolution(userSolution!);
            } else {
                console.log("SAVE USER SOLUTION: LOCAL STORAGE", userSolution);
                localStorage.setItem(`user-solution-${userSolution.solutionId}`, JSON.stringify(userSolution));
            }

            if (userSolution.state !== "Unsolved") {
                setLoadedSolved(true);
            }
        }

        if (!rows || userSolutionLoading) return;

        saveUserSolution();
    }, [userSolution]);

    useUpdateEffect(() => {
        if (!userSolutionLoading) return;

        const tempRows = initRows();
        const numRows = Math.min(userSolution.guesses.length, maxGuesses);
        for (let r = 0; r < numRows; r++) {
            const numChars = Math.min(userSolution.guesses[r].length, wordLength);
            for (let c = 0; c < numChars; c++) {
                const letter = userSolution.guesses[r][c];
                tempRows[r][c].value = letter;
                if (solution.solution[c].toLocaleUpperCase() === letter.toLocaleUpperCase())
                    tempRows[r][c].status = "Correct";
                else if (solution.solution.toLocaleUpperCase().includes(letter.toLocaleUpperCase()))
                    tempRows[r][c].status = "Present";
                else
                    tempRows[r][c].status = "Absent";
            }
        }

        setCurrentRowIndex(userSolution.guesses.length);
        setGameState(userSolution.state);
        setRows(tempRows);
        setUserSolutionLoading(false);
        setLoadedSolved(userSolution.state !== "Unsolved"); // Prevents solution from being saved when it is already completed.
    }, [userSolutionLoading]);

    useEffect(() => {
        const isPlaying = userSolutionLoading || currentRowIndex > 0 || gameState !== "Unsolved";
        settings.setCanSetIsHardMode(!isPlaying);
    }, [settings, userSolutionLoading, currentRowIndex, gameState]);

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