﻿"use client";

import {useEffect, useRef, useState} from "react";
import {GameStates, IUserPuzzleSolution, Row} from "@/types";
import Keyboard from "@/components/game/keyboard";
import isValidWord from "../../lib/dictionary";
import {REVEAL_TIME_MS} from "@/constants";
import GameGrid from "@/components/game/grid";
import {Puzzle, Solution} from "@prisma/client";
import {useAsync, useDebounce, useEffectOnce, useUnmount, useUpdateEffect} from "react-use";
import {alertError, clearAlert} from "@/lib/alerts";
import {upsertUserSolution} from "@/lib/user-service";
import {useSettings} from "@/providers/SettingsProvider";
import {useCurrentPuzzle} from "@/providers/PuzzleProvider";
import {findFirstUnusedReveal, getGuessRows, setRowGuessStatuses} from "@/lib/guesses";
import {Tooltip} from "@nextui-org/tooltip";
import {asDateOnly} from "@/lib/date-util";
import {useGlobalModal} from "@/providers/GlobalModalProvider";

type Props = {
    puzzle: Puzzle;
    solution: Solution;
    initialUserSolution: IUserPuzzleSolution;
}

export default function GamePanel({puzzle, solution, initialUserSolution}: Props) {
    const {setCurrentPuzzle, setCurrentSolution, setCurrentUserSolution} = useCurrentPuzzle();
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
    const [currentRowClass, setCurrentRowClass] = useState("");
    const [isUsingHardMode, setIsUsingHardMode] = useState(false);
    const [isJustCompleted, setIsJustCompleted] = useState(false);
    const rankingModal = useGlobalModal("ranking");

    function clearCurrentRowClass () {
        setCurrentRowClass("")
    }

    const wordLength: number = solution.solution.length;
    const maxGuesses: number = solution.maxGuesses;

    useEffect(() => {
        setCurrentPuzzle(puzzle);
        setCurrentSolution(solution);
    }, [setCurrentPuzzle, setCurrentSolution, puzzle, solution]);

    function handleLetterClick(letter: string) {
        if (gameState !== "Unsolved") return;
        if (text.length >= wordLength) return;
        setText(text + letter);
    }

    function getStatuses() {
        const currentRow = rows[currentRowIndex];
        setRowGuessStatuses(solution.solution, currentRow);
        setRows([...rows]);
    }

    function handleSubmit() {
        if (gameState !== "Unsolved") return;

        clearAlert(alertId);
        clearCurrentRowClass();
        if (text.length !== wordLength) {
            setCurrentRowClass('jiggle');
            setTimeout(() => clearCurrentRowClass(), 1000);
            setAlertId(alertError("Not enough letters", 1500));
            return;
        }
        const isSolution = solution.solution.toLocaleUpperCase() === text.toLocaleUpperCase();
        if (!isValidWord(text) && !isSolution) {
            setCurrentRowClass('jiggle');
            setTimeout(() => clearCurrentRowClass(), 1000);
            setAlertId(alertError("Not in word list", 1500));
            return;
        }

        if (settings.isHardMode || isUsingHardMode) {
            setIsUsingHardMode(true);
            const firstMissingReveal = findFirstUnusedReveal(text, solution.solution, userSolution);
            if (firstMissingReveal) {
                setCurrentRowClass('jiggle');
                setTimeout(() => clearCurrentRowClass(), 1000);
                setAlertId(alertError(firstMissingReveal, 1500));
                return;
            }
        }

        setIsRevealing(true);
        getStatuses();
        clearTimeout(timer.current)
        timer.current = setTimeout(() => {
            setIsRevealing(false);
        }, REVEAL_TIME_MS * wordLength);

        if (isSolution) {
            setGameState("Win");
            setIsJustCompleted(true);
        } else if (currentRowIndex === rows.length - 1) {
            setGameState("Loss");
            setIsJustCompleted(true);
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
            const localStorageValue = localStorage.getItem(`user-solution-${solution.id}`);
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
        if (rows.length === 0 || currentRowIndex > rows.length - 1 || currentRowIndex < 0) return;
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
            state: gameState,
            hardMode: isUsingHardMode,
            puzzleId: puzzle.id,
            solutionDate: asDateOnly(solution.date),
            maxGuesses: maxGuesses,
            solutionWord: solution.solution
        } as IUserPuzzleSolution)
    }, 100, [gameState, currentRowIndex, isUsingHardMode]);

    useAsync(async () => {
        async function saveUserSolution() {
            // Don't save state if the user hasn't started playing.
            if (userSolutionLoading || !userSolution || currentRowIndex <= 0) return;

            // If the solution is already solved, no need to save.
            if (loadedSolved) return;

            if (userSolution.userId) {
                await upsertUserSolution(userSolution!);
            } else {
                localStorage.setItem(`user-solution-${userSolution.solutionId}`, JSON.stringify(userSolution));
            }

            if (userSolution.state !== "Unsolved") {
                setLoadedSolved(true);
            }
        }

        if (!rows || userSolutionLoading) return;

        await saveUserSolution();

        if (!isRevealing)
            setCurrentUserSolution(userSolution);
    }, [userSolution, isRevealing]);

    useUpdateEffect(() => {
        if (!isJustCompleted || isRevealing || !rankingModal) return;
        rankingModal.onOpen();
        setIsJustCompleted(false);
    }, [isJustCompleted, isRevealing]);

    useUpdateEffect(() => {
        if (!userSolutionLoading) return;
        const tempRows = getGuessRows(solution.solution, userSolution, maxGuesses, wordLength);
        setCurrentRowIndex(userSolution.guesses.length);
        setGameState(userSolution.state);
        setRows(tempRows);
        setUserSolutionLoading(false);
        setIsUsingHardMode(userSolution.hardMode);
        setLoadedSolved(userSolution.state !== "Unsolved"); // Prevents solution from being saved when it is already completed.
    }, [userSolutionLoading]);

    useEffect(() => {
        const isPlaying = userSolutionLoading || currentRowIndex > 0 || gameState !== "Unsolved";
        settings.setCanSetIsHardMode(!isPlaying);
    }, [settings, userSolutionLoading, currentRowIndex, gameState]);

    useUnmount(() => {
        setCurrentUserSolution(null);
    })


    return (
        <div
            className="mx-auto flex w-full grow flex-col px-1 pb-2 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 pt-2 short:pt-2">
            <div className="flex flex-col items-center justify-center pt-0 pb-2 short:pb-1 space-y-1">
                {(isUsingHardMode || settings.isHardMode) &&
                    <Tooltip content="Any revealed hints must be used in subsequent guesses">
                        <p className="prevent-select font-semibold text-sm px-2 pb-2 text-warning-900 dark:text-warning-400">Hard Mode</p>
                    </Tooltip>}
                {gameState == "Loss" && <p className="prevent-select uppercase text-lg font-semibold tracking-widest px-2 pb-1 rounded shadowed bg-red-400 dark:bg-red-700 text-white border-slate-400 dark:border-slate-700">
                    {solution.solution}
                </p>}
            </div>
            <div className="flex grow flex-col">
                <GameGrid
                    rows={rows}
                    isRevealing={isRevealing}
                    currentRowIndex={currentRowIndex}
                    currentRowClassName={currentRowClass}
                />
                <Keyboard
                    onLetterClick={handleLetterClick}
                    onSubmit={handleSubmit}
                    solution={solution.solution}
                    rows={rows.slice(0, currentRowIndex)}
                    onDelete={deleteChar}
                    isRevealing={isRevealing}
                />
            </div>
        </div>
    )
}