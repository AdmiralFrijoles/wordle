﻿import {Puzzle} from "@prisma/client";

export enum GameStates {
    Unsolved = 0,
    Win = 1,
    Loss = 2
}

export enum Status {
    Absent = 0,
    Present = 1,
    Correct = 2,
    Guessing = 3
}

export type CharStatus = keyof typeof Status;

interface Cell {
    value: string;
    status: CharStatus;
}

export type Row = Cell[];


export interface IUserPuzzleSolution {
    userId: string;
    solutionId: string;
    state: keyof typeof GameStates;
    guesses: string[];
    hardMode: boolean;
}

export type PuzzleStats = {
    puzzle: Puzzle;
    winDistribution: number[];
    gamesFailed: number;
    currentStreak: number;
    bestStreak: number;
    totalGames: number;
    successRate: number;
}