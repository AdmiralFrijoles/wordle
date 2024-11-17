"use server";

import prisma from "./prisma"
import {Puzzle, Solution} from "@prisma/client";
import {fetchFromCache} from "@/lib/cache";
import {getAppSetting, setAppSetting} from "@/lib/settings-service";
import {formatISO} from "date-fns";
import {UTCDate} from "@date-fns/utc";

// 6 hours
const defaultTTL: number = 1000 * 60 * 60 * 6;

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
    const defaultPuzzleSlug = await getAppSetting<string>("DEFAULT_PUZZLE_SLUG");
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

export async function getPuzzleSolution(puzzleId: string, solutionDate: Date): Promise<Solution | null> {
    const isoDate = formatISO(new UTCDate(solutionDate.getFullYear(), solutionDate.getMonth(), solutionDate.getDate()));
    return prisma.solution.findUnique({
        where: {
            puzzleId_date: {
                puzzleId: puzzleId,
                date: isoDate
            }
        }
    });
}