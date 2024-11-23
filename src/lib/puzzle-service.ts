"use server";

import prisma from "./prisma"
import {Puzzle, Solution} from "@prisma/client";
import {fetchFromCache} from "@/lib/cache";
import {getAppSetting, setAppSetting} from "@/lib/settings-service";
import {formatISO} from "date-fns";
import {UTCDate} from "@date-fns/utc";
import {auth} from "@/lib/auth";
import {DateOnly} from "@/types";
import {SETTING_DEFAULT_PUZZLE} from "@/constants/settings";

// 6 hours
const defaultTTL: number = 1000 * 60 * 60 * 6;

export async function listPuzzlesForUser(): Promise<Puzzle[]> {
    const session = await auth();
    if (!session) {
        return prisma.puzzle.findMany({
            where: {isPublic: true}
        });
    } else {
        return prisma.puzzle.findMany({
            where: {isPublic: true} // TODO: Filter by user access
        });
    }
}

export async function listDatesForPuzzle(puzzleId: string): Promise<Date[]> {
    const results = await prisma.solution.findMany({
        where: {puzzleId: puzzleId},
        select: {date: true},
        orderBy: {date: "asc"}
    });

    return results.map(result => result.date);
}

export async function getPuzzleBySlug(slug: string): Promise<Puzzle | null> {
    const cacheKey = `puzzle-by-slug-${slug}`;
    return await fetchFromCache<Puzzle>(
        cacheKey,
        () => prisma.puzzle.findUnique({where: {slug: slug}}),
        defaultTTL
    );
}

export async function getPuzzleCount(publicOnly: boolean = true): Promise<number> {
    const cacheKey = `puzzle-count-${publicOnly}`;
    return (await fetchFromCache(
        cacheKey,
        () => prisma.puzzle.count({where: {isPublic: publicOnly ? true : undefined}})
    )) ?? 0;
}

export async function getRandomPublicPuzzle(): Promise<Puzzle | null> {
    const availablePuzzles: Puzzle[] = await prisma.puzzle.findMany({
        where: {isPublic: true},
        orderBy: {id: "asc"}
    });

    const numPuzzles = availablePuzzles.length;
    if (numPuzzles <= 0) return null;
    else if (numPuzzles === 1) return availablePuzzles[0];
    return availablePuzzles[Math.floor(Math.random() * numPuzzles)];
}

export async function getDefaultPuzzleSlug(): Promise<string | null> {
    const defaultPuzzleSlug = await getAppSetting<string>(SETTING_DEFAULT_PUZZLE);
    if (defaultPuzzleSlug) {
        return defaultPuzzleSlug;
    }

    const defaultPuzzle = await prisma.puzzle.findFirst({
        select: {slug: true},
        where: {isPublic: true},
        orderBy: {id: "asc"}
    });

    if (defaultPuzzle) {
        await setAppSetting<string>("DEFAULT_PUZZLE_SLUG", defaultPuzzle.slug);
        return defaultPuzzle.slug;
    }

    return null;
}

export async function getDefaultPuzzle(): Promise<Puzzle | null> {
    const defaultPuzzleSlug = await getDefaultPuzzleSlug();
    if (defaultPuzzleSlug) {
        return await getPuzzleBySlug(defaultPuzzleSlug);
    }
    return null;
}

export async function getPuzzleSolution(puzzleId: string, solutionDate: DateOnly | null): Promise<Solution | null> {
    if (solutionDate) {
        const isoDate = formatISO(new UTCDate(solutionDate.year, solutionDate.month, solutionDate.day));
        return prisma.solution.findUnique({
            where: {
                puzzleId_date: {
                    puzzleId: puzzleId,
                    date: isoDate
                }
            }
        });
    } else {
        return prisma.solution.findFirst({
            where: {
                puzzleId: puzzleId
            },
            orderBy: {date: "desc"}
        })
    }
}

export async function getPuzzleNeighboringSolutions(puzzleId: string, solutionDate: DateOnly): Promise<{previous: Solution | null, next: Solution | null}> {
    const isoDate = formatISO(new UTCDate(solutionDate.year, solutionDate.month, solutionDate.day));
    const previousSolution = await prisma.solution.findFirst({
        where: { puzzleId: puzzleId, date: {lt: isoDate} },
        orderBy: {date: "desc"}
    });

    const nextSolution = await prisma.solution.findFirst({
        where: { puzzleId: puzzleId, date: {gt: isoDate} },
        orderBy: {date: "asc"}
    });

    return {
        previous: previousSolution,
        next: nextSolution
    }
}

export async function solutionExists(puzzleId: string, solutionDate: DateOnly) {
    const isoDate = formatISO(new UTCDate(solutionDate.year, solutionDate.month, solutionDate.day));
    const count = await prisma.solution.count({
        where: {
            puzzleId: puzzleId,
            date: isoDate
        }
    });
    return count > 0;
}