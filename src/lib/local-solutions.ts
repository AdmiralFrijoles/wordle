"use client";

import {IUserPuzzleSolution} from "@/types";

const KEY_PREFIX = "user-solution-";

export function listLocalUserSolutions(puzzleId: string): IUserPuzzleSolution[] {
    const solutions: IUserPuzzleSolution[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith(KEY_PREFIX)) {
            continue;
        }
        const value = localStorage.getItem(key);
        if (!value) {
            continue;
        }
        try {
            const solution = JSON.parse(value) as IUserPuzzleSolution;
            if (solution.puzzleId === puzzleId) {
                solutions.push(solution);
            }
        } catch (e) {
            console.error(`Skipping unreadable saved game ${key}:`, e);
        }
    }
    return solutions;
}
