"use server";

import prisma from "@/lib/prisma";
import {GameStates, IUserPuzzleSolution} from "@/types";
import {UserSolution, UserSolutionState} from "@prisma/client";

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

function toUserPuzzleSolution(userSolution: UserSolution): IUserPuzzleSolution {
    return {
        userId: userSolution.userId,
        solutionId: userSolution.solutionId,
        guesses: userSolution.guesses,
        state: toGameState(userSolution.state)
    } as IUserPuzzleSolution;
}

export async function getUserSolution(userId: string, solutionId: string): Promise<IUserPuzzleSolution | null> {
    const userSolution = await prisma.userSolution.findUnique({
        where: {
            userId_solutionId: {
                userId: userId,
                solutionId: solutionId
            }
        }
    });

    if (userSolution) {
        return toUserPuzzleSolution(userSolution);
    }

    return null;
}

export async function setUserSolution(userSolution: IUserPuzzleSolution): Promise<void> {
    await prisma.userSolution.upsert({
        where: {
            userId_solutionId: {
                userId: userSolution.userId,
                solutionId: userSolution.solutionId
            }
        },
        update: {
            guesses: userSolution.guesses,
            state: fromGameState(userSolution.state)
        },
        create: {
            userId: userSolution.userId,
            solutionId: userSolution.solutionId,
            guesses: userSolution.guesses,
            state: fromGameState(userSolution.state)
        }
    });
}
