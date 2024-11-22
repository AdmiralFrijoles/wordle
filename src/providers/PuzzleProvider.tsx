"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {Puzzle, Solution} from "@prisma/client";
import {IUserPuzzleSolution} from "@/types";

type Props = {
    children: React.ReactNode
}

type ContextProps = {
    currentPuzzle: Puzzle | null;
    setCurrentPuzzle: (puzzle: Puzzle | null) => void;

    currentSolution: Solution | null;
    setCurrentSolution: (solution: Solution | null) => void;

    currentUserSolution: IUserPuzzleSolution | null;
    setCurrentUserSolution: (solution: IUserPuzzleSolution | null) => void;
}

const PuzzleContext = createContext<ContextProps>({
    currentPuzzle: null,
    setCurrentPuzzle: () => {},

    currentSolution: null,
    setCurrentSolution: () => {},

    currentUserSolution: null,
    setCurrentUserSolution: () => {},
});

export function CurrentPuzzleProvider({children}: Props) {
    const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
    const [currentSolution, setCurrentSolution] = useState<Solution | null>(null);
    const [currentUserSolution, setCurrentUserSolution] = useState<IUserPuzzleSolution | null>(null);

    return (
        <PuzzleContext.Provider value={{
            currentPuzzle, setCurrentPuzzle,
            currentSolution, setCurrentSolution,
            currentUserSolution, setCurrentUserSolution
        }}>
            {children}
        </PuzzleContext.Provider>
    )
}

export function useCurrentPuzzle() {
    const data = useContext(PuzzleContext);
    if (!data) {
        throw new Error("Data must be provided");
    }
    return data;
}

export function SetCurrentPuzzleContext({puzzle}: { puzzle: Puzzle }) {
    const {setCurrentPuzzle} = useCurrentPuzzle();
    useEffect(() => {
        setCurrentPuzzle(puzzle);
    }, [setCurrentPuzzle, puzzle]);
    return null;
}