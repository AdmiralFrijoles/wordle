import {IUserPuzzleSolution, Row} from "@/types";

export function initRows(
    maxGuesses: number,
    wordLength: number
) {
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

export function getGuessRows(
    solution: string,
    userSolution: IUserPuzzleSolution,
    maxGuesses: number,
    wordLength: number
) {
    const tempRows = initRows(maxGuesses, wordLength);
    const numRows = Math.min(userSolution.guesses.length, maxGuesses);
    for (let r = 0; r < numRows; r++) {
        const numChars = Math.min(userSolution.guesses[r].length, wordLength);
        for (let c = 0; c < numChars; c++) {
            const letter = userSolution.guesses[r][c];
            tempRows[r][c].value = letter;
            if (solution[c].toLocaleUpperCase() === letter.toLocaleUpperCase())
                tempRows[r][c].status = "Correct";
            else if (solution.toLocaleUpperCase().includes(letter.toLocaleUpperCase()))
                tempRows[r][c].status = "Present";
            else
                tempRows[r][c].status = "Absent";
        }
    }
    return tempRows;
}
