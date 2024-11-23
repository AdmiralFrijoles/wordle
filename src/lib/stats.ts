import {IUserPuzzleSolution, PuzzleStats} from "@/types";
import {CalendarDate} from "@internationalized/date";

const defaultPuzzleStats: PuzzleStats = {
    currentStreak: 0,
    successRate: 0,
    totalGames: 0,
    bestStreak: 0,
    gamesFailed: 0,
    winDistribution: []
};

export function buildStats(userSolutions: IUserPuzzleSolution[]): PuzzleStats {
    if (!userSolutions || userSolutions.length === 0) return defaultPuzzleStats;

    userSolutions = userSolutions.sort((a, b) => {
        const aDate = new CalendarDate(a.solutionDate.year, a.solutionDate.month, a.solutionDate.day);
        const bDate = new CalendarDate(b.solutionDate.year, b.solutionDate.month, b.solutionDate.day);
        return aDate.compare(bDate);
    })

    const puzzleMaxGuesses = userSolutions
        .map(s => s.maxGuesses)
        .reduce((a, b) => Math.max(a ?? 6, b ?? 6));

    const winDistribution = Array.from(new Array(puzzleMaxGuesses), () => 0);

    let numFailed = 0;
    let numWins = 0;
    let bestStreak = 0;
    let currentStreak = 0;
    for (let i = 0; i < userSolutions.length; i++) {
        const userSolution = userSolutions[i];
        if (userSolution.state === "Win") {
            numWins++;
            currentStreak++;
            bestStreak = Math.max(bestStreak, currentStreak);
            winDistribution[userSolution.guesses.length]++;
        } else {
            numFailed++;
            currentStreak = 0;
        }
    }

    const successRate = numWins / userSolutions.length;

    return {
        ...defaultPuzzleStats,
        totalGames: userSolutions.length,
        successRate: successRate,
        gamesFailed: numFailed,
        bestStreak: bestStreak,
        currentStreak: currentStreak,
        winDistribution: winDistribution,
    };
}