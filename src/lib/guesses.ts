import {IUserPuzzleSolution, Row} from "@/types";
import GraphemeSplitter from "grapheme-splitter";

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

export function findFirstUnusedReveal(
    currentGuess: string,
    solution: string,
    userSolution: IUserPuzzleSolution
) {
    if (userSolution.guesses.length === 0) {
        return false
    }

    const lettersLeftArray = new Array<string>()
    const lastGuess = userSolution.guesses[userSolution.guesses.length - 1]
    const guessRows = getGuessRows(solution, userSolution, userSolution.guesses.length, solution.length);
    const statuses = guessRows[userSolution.guesses.length - 1].map((cell) => cell.status);

    const splitCurrentGuess = unicodeSplit(currentGuess)
    const splitLastGuess = unicodeSplit(lastGuess)

    for (let i = 0; i < splitLastGuess.length; i++) {
        if (statuses[i] === 'Correct' || statuses[i] === 'Present') {
            lettersLeftArray.push(splitLastGuess[i])
        }
        if (statuses[i] === 'Correct' && splitCurrentGuess[i] !== splitLastGuess[i]) {
            return `Must use ${splitLastGuess[i]} in position ${i + 1}`;
        }
    }

    // check for the first unused letter, taking duplicate letters
    // into account - see issue #198
    let n
    for (const letter of splitCurrentGuess) {
        n = lettersLeftArray.indexOf(letter)
        if (n !== -1) {
            lettersLeftArray.splice(n, 1)
        }
    }

    if (lettersLeftArray.length > 0) {
        return `Guess must contain ${lettersLeftArray[0]}`;
    }
    return false
}

export function unicodeSplit (word: string) {
    return new GraphemeSplitter().splitGraphemes(word)
}