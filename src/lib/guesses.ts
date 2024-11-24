import {CharStatus, IUserPuzzleSolution, Row} from "@/types";
import GraphemeSplitter from "grapheme-splitter";

export function initRows(
    maxGuesses: number,
    wordLength: number,
    userSolution?: IUserPuzzleSolution
) {
    const temp: Row[] = [];
    for (let i = 0; i < maxGuesses; i++) {
        const tempRow: Row = [];
        for (let j = 0; j < wordLength; j++) {
            const letter = userSolution && userSolution.guesses.length > i && userSolution.guesses[i].length > j ? userSolution.guesses[i][j] : null;
            tempRow.push({
                value: letter?.toLocaleUpperCase() ?? "",
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
    const tempRows = initRows(maxGuesses, wordLength, userSolution);
    tempRows.forEach((row) => {
        setRowGuessStatuses(solution, row);
    });
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

export function getKeyboardGuessStatuses(solution: string, guesses: Row[]): {[key: string]: CharStatus} {
    const charObj: {[key: string]: CharStatus} = {};
    const splitSolution = unicodeSplit(solution.toLocaleUpperCase());
    guesses.forEach((row) => {
        row.forEach((cell, i) => {
            if (!splitSolution.includes(cell.value.toLocaleUpperCase())) {
                return (charObj[cell.value.toLocaleUpperCase()] = "Absent");
            }

            if (cell.value.toLocaleUpperCase() === splitSolution[i]) {
                return (charObj[cell.value.toLocaleUpperCase()] = "Correct");
            }

            if (charObj[cell.value.toLocaleUpperCase()] !== "Correct") {
                return (charObj[cell.value.toLocaleUpperCase()] = "Present");
            }
        })
    })
    return charObj;
}

export function setRowGuessStatuses(
    solution: string,
    guess: Row
) {
    // If the row is empty then the user hasn't made a guess yet.
    if (!guess.every(x => x.value !== "")) {
        guess.forEach(x => x.status = "Guessing")
        return;
    }

    const splitSolution = unicodeSplit(solution.toLocaleUpperCase());
    const solutionCharsTaken = splitSolution.map(() => false);

    // First we check if any letter is in the correct place
    guess.forEach((cell, i) => {
        if (cell.value.toLocaleUpperCase() === splitSolution[i]) {
            cell.status = "Correct";
            solutionCharsTaken[i] = true;
            return;
        }
    });

    // Then check if any unused letters are present in the solution
    guess.forEach((cell) => {
        if (cell.status !== "Guessing") return;

        if (!splitSolution.includes(cell.value.toLocaleUpperCase())) {
            cell.status = "Absent";
            return;
        }

        const indexOfPresentChar = splitSolution.findIndex(
            (x, index) => x === cell.value.toLocaleUpperCase() && !solutionCharsTaken[index]
        );

        if (indexOfPresentChar > -1) {
            cell.status = "Present";
            solutionCharsTaken[indexOfPresentChar] = true;
            return;
        } else {
            cell.status = "Absent";
            return;
        }
    });
}