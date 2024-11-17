import prisma from "./prisma"
import {Puzzle} from "@prisma/client";
import {fetchFromCache} from "@/lib/cache";


export async function getPuzzleBySlug(slug: string): Promise<Puzzle | null> {
    const cacheKey = `puzzle-by-slug-${slug}`;
    return await fetchFromCache<Puzzle>(
        cacheKey,
        () => prisma.puzzle.findUnique({where: {slug: slug}}),
        1000 * 60 * 6
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
