export enum GameStates {
    Playing = 0,
    Win = 1,
    Lose = 2
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