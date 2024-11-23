import {Puzzle, Solution} from "@prisma/client";
import {IUserPuzzleSolution} from "@/types";
import { UAParser } from 'ua-parser-js'
import {getGuessRows} from "@/lib/guesses";
import {format} from "date-fns";
import {utc} from "@date-fns/utc/utc";

const webShareApiDeviceTypes: string[] = ['mobile', 'smarttv', 'wearable']
const parser = new UAParser();
const browser = parser.getBrowser();
const device = parser.getDevice();


export default function shareStats(
    appTitle: string,
    puzzle: Puzzle,
    solution: Solution,
    userSolution: IUserPuzzleSolution,
    isHardMode: boolean,
    isDarkMode: boolean,
    isHighContrastMode: boolean,
    handleShareToClipboard: () => void,
    handleShareFailure: () => void,
    markdown: boolean
) {
    const numberFormat = new Intl.NumberFormat();

    const puzzleUrl = new URL(`${puzzle.slug}`, window.location.origin);
    const puzzleDateUrl = new URL(`${puzzle.slug}/${format(solution.date, "yyyy/MM/dd", {in: utc})}`, window.location.origin);

    let textToShare: string;
    if (markdown) {
        textToShare =
            `**[${appTitle} - ${puzzle.title}](<${puzzleUrl.href}>)**\n*[${format(solution.date, "PP", {in: utc})}](<${puzzleDateUrl.href}>)*\n${
                userSolution.state === "Loss" ? 'X' : numberFormat.format(userSolution.guesses.length)
            }/${numberFormat.format(solution.maxGuesses)}${isHardMode ? '*' : ''}\n\n` +
            generateEmojiGrid(
                solution,
                userSolution,
                getEmojiTiles(isDarkMode, isHighContrastMode)
            );
    } else {
        textToShare =
            `${appTitle} - ${puzzle.title}\n${format(solution.date, "PP", {in: utc})}\n${
                userSolution.state === "Loss" ? 'X' : numberFormat.format(userSolution.guesses.length)
            }/${numberFormat.format(solution.maxGuesses)}${isHardMode ? '*' : ''}\n\n` +
            generateEmojiGrid(
                solution,
                userSolution,
                getEmojiTiles(isDarkMode, isHighContrastMode)
            );
    }

    const shareData = { text: textToShare }
    let shareSuccess = false

    try {
        if (attemptShare(shareData)) {
            navigator.share(shareData)
            shareSuccess = true
        }
    } catch (e) {
        console.error(e);
        shareSuccess = false
    }

    try {
        if (!shareSuccess) {
            if (navigator.clipboard) {
                navigator.clipboard
                    .writeText(textToShare)
                    .then(handleShareToClipboard)
                    .catch(handleShareFailure)
            } else {
                handleShareFailure()
            }
        }
    } catch (e) {
        console.error(e);
        handleShareFailure()
    }
}

export function generateEmojiGrid(solution: Solution, userSolution: IUserPuzzleSolution, tiles: string[]) {
    const rows = getGuessRows(solution.solution, userSolution, solution.maxGuesses, solution.solution.length);

    return rows.filter((row) => row.every(cell => cell.status !== "Guessing"))
        .map((row) =>
        row.map((cell) => {
            switch (cell.status) {
                case 'Correct':
                    return tiles[0]
                case 'Present':
                    return tiles[1]
                default:
                    return tiles[2]
            }
        }).join("")
    ).join("\n");
}

function attemptShare(shareData: object) {
    return (
        // Deliberately exclude Firefox Mobile, because its Web Share API isn't working correctly
        browser.name?.toUpperCase().indexOf('FIREFOX') === -1 &&
        webShareApiDeviceTypes.indexOf(device.type ?? '') !== -1 &&
        navigator.canShare &&
        navigator.canShare(shareData) &&
        navigator.share
    );
}

function getEmojiTiles(isDarkMode: boolean, isHighContrast: boolean) {
    const tiles: string[] = []
    tiles.push(isHighContrast ? '🟧' : '🟩') // Correct
    tiles.push(isHighContrast ? '🟦' : '🟨') // Present
    tiles.push(isDarkMode ? '⬛' : '⬜') // All other statuses
    return tiles
}