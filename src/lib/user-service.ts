"use server";

import prisma from "@/lib/prisma";
import {DateOnly, GameStates, IUserPuzzleSolution, IUserSolutionDate, PuzzleStats} from "@/types";
import {Solution, UserSolution, UserSolutionState} from "@prisma/client";
import {auth} from "@/lib/auth";
import {buildStats} from "@/lib/stats";
import {asDateOnly} from "@/lib/date-util";

function toGameState(state: UserSolutionState): keyof typeof GameStates {
    switch (state) {
        default:
            return "Unsolved";
        case "UNSOLVED":
            return "Unsolved";
        case "WIN":
            return "Win";
        case "LOSS":
            return "Loss";
    }
}

function fromGameState(state: keyof typeof GameStates): UserSolutionState {
    switch (state) {
        default:
            return "UNSOLVED";
        case "Unsolved":
            return "UNSOLVED";
        case "Win":
            return "WIN";
        case "Loss":
            return "LOSS";
    }
}

function toUserPuzzleSolution(userSolution: UserSolution, solution: Solution): IUserPuzzleSolution {
    return {
        userId: userSolution.userId,
        solutionId: userSolution.solutionId,
        guesses: userSolution.guesses,
        state: toGameState(userSolution.state),
        hardMode: userSolution.hardMode,
        puzzleId: solution.puzzleId,
        solutionDate: asDateOnly(solution.date),
        maxGuesses: solution.maxGuesses,
        solutionWord: solution.solution
    } as IUserPuzzleSolution;
}

export async function getUserSolution(userId: string, solutionId: string): Promise<IUserPuzzleSolution | null> {
    const userSolution = await prisma.userSolution.findUnique({
        include: {solution: true},
        where: {
            userId_solutionId: {
                userId: userId,
                solutionId: solutionId
            }
        }
    });

    if (userSolution) {
        return toUserPuzzleSolution(userSolution, userSolution.solution);
    }

    return null;
}

export async function upsertUserSolution(userSolution: IUserPuzzleSolution): Promise<void> {
    const session = await auth();
    if (!session) {
        throw new Error("Not authorized");
    } else if (session.user?.id != userSolution.userId && session.user.role !== "admin") {
        throw new Error("Not authorized");
    }

    // Allow admins to change solutions
    if (session.user.role === "admin") {
        console.log("Admin upsert")
        await prisma.userSolution.upsert({
            where: {
                userId_solutionId: {
                    userId: userSolution.userId,
                    solutionId: userSolution.solutionId
                }
            },
            update: {
                guesses: userSolution.guesses,
                state: fromGameState(userSolution.state),
                hardMode: userSolution.hardMode
            },
            create: {
                userId: userSolution.userId,
                solutionId: userSolution.solutionId,
                guesses: userSolution.guesses,
                state: fromGameState(userSolution.state),
                hardMode: userSolution.hardMode
            }
        });
    } else {
        const existingSolution = await prisma.userSolution.findUnique({
            where: {
                userId_solutionId: {
                    userId: userSolution.userId,
                    solutionId: userSolution.solutionId
                }
            },
        });

        console.log("existingSolution", existingSolution);

        if (!existingSolution) {
            await prisma.userSolution.create({
                data: {
                    userId: userSolution.userId,
                    solutionId: userSolution.solutionId,
                    guesses: userSolution.guesses,
                    state: fromGameState(userSolution.state)
                }
            });
        } else {
            // User cannot change the state of a completed solution
            if (existingSolution.state === "WIN" || existingSolution.state === "LOSS") {
                console.log("Cannot change state of completed solution.")
                return;
            }

            if (existingSolution.hardMode && !userSolution.hardMode) {
                console.log("Cannot disable hard mode once started.")
            } else {
                existingSolution.hardMode = userSolution.hardMode;
            }

            existingSolution.state = fromGameState(userSolution.state);

            // User can only add new guesses, not modify old ones.
            if (existingSolution.guesses.length < userSolution.guesses.length) {
                const guessesToAdd = userSolution.guesses.slice(existingSolution.guesses.length, userSolution.guesses.length);
                console.log("guessesToAdd", guessesToAdd)
                existingSolution.guesses = [...existingSolution.guesses.concat(guessesToAdd)];
            }

            await prisma.userSolution.update({
                where: {id: existingSolution.id},
                data: {
                    guesses: existingSolution.guesses,
                    state: existingSolution.state,
                    hardMode: existingSolution.hardMode
                }
            });
        }
    }


}

export async function getUserPuzzleStats(userId: string, puzzleId: string): Promise<PuzzleStats> {
    const userSolutions = await prisma.userSolution.findMany({
        include: {solution: true},
        where: {
            userId: userId,
            solution: {puzzleId: puzzleId},
            NOT: {
                state: "UNSOLVED"
            }
        }
    });

    return buildStats(userSolutions.map(userSolution => toUserPuzzleSolution(userSolution, userSolution.solution)));
}

export async function getUserSolutionDates(puzzleId: string, userId?: string | undefined): Promise<IUserSolutionDate[]> {
    const session = await auth();
    if (!userId) userId = session?.user?.id;
    if (!session) {
        throw new Error("Not authorized");
    } else if (session.user?.id !== userId && session.user.role !== "admin") {
        throw new Error("Not authorized");
    }

    const results = await prisma.userSolution.findMany({
        where: {
            userId: userId,
            solution: {puzzleId: puzzleId},
        },
        select: {
            solution: {
                select: {
                    date: true
                }
            },
            state: true
        }
    });

    return results.map(x => {
        return {
            date: {
                year: x.solution.date.getUTCFullYear(),
                month: x.solution.date.getUTCMonth() + 1,
                day: x.solution.date.getUTCDate()
            } as DateOnly,
            state: toGameState(x.state)
        }
    });
}




