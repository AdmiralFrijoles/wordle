"use client";

import {CalendarDate, getLocalTimeZone, today} from "@internationalized/date";
import {notFound, usePathname, useRouter} from "next/navigation";
import {useCurrentPuzzle} from "@/providers/PuzzleProvider";
import {useAsync, useMountedState} from "react-use";
import {useState} from "react";
import {PuzzlePageSkeleton} from "@/app/[[...puzzle]]/_components/skeleton";
import {
    getDefaultPuzzleSlug,
    getPuzzleBySlug,
    getPuzzleNeighboringSolutions,
    getPuzzleSolution
} from "@/lib/puzzle-service";
import {asDateOnly} from "@/lib/date-util";
import NoSolution from "@/app/[[...puzzle]]/no-solution";
import {useSession} from "next-auth/react"
import {getUserSolution} from "@/lib/user-service";
import {IUserPuzzleSolution} from "@/types";
import GamePanel from "@/components/game";
import {GamePanelHeader} from "@/components/game/header";

function parseDateParts(parts: string[]): CalendarDate | null {
    if (parts && parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);

        if (year && month && day) {
            return new CalendarDate(year, month, day);
        }
    }
    return null;
}

type PathProps = {
    puzzleSlug: string | null;
    date: CalendarDate | null;
}

const defaultPathProps: PathProps = {
    puzzleSlug: null,
    date: null
};

function parsePathString(path: string): PathProps {
    if (!path) return defaultPathProps;

    const routeParams = path.split("/").slice(1);
    if (!routeParams || routeParams.length === 0) return defaultPathProps;

    const puzzleSlug: string | null = routeParams[0];
    const date: CalendarDate | null = parseDateParts(routeParams.slice(1));

    return {
        puzzleSlug,
        date
    };
}

export default function Page() {
    const { data: session, status: sessionStatus } = useSession();
    const router = useRouter();
    const isMounted = useMountedState();
    const userTimeZone = getLocalTimeZone();
    const localToday = today(userTimeZone);
    const currentPath = usePathname();
    const {puzzleSlug: puzzleSlugFromRoute, date: dateFromRoute} = parsePathString(currentPath);
    const {
        currentPuzzle, setCurrentPuzzle,
        currentSolution, setCurrentSolution,
        currentUserSolution, setCurrentUserSolution
    } = useCurrentPuzzle();
    const [isLoading, setIsLoading] = useState(true);
    const selectedDate = dateFromRoute ? dateFromRoute : localToday;
    const [previousPuzzleDate, setPreviousPuzzleDate] = useState<CalendarDate | null>(null);
    const [nextPuzzleDate, setNextPuzzleDate] = useState<CalendarDate | null>(null);

    function clearSolution() {
        setCurrentSolution(null);
        setCurrentUserSolution(null);
    }

    function clearPuzzle() {
        setCurrentPuzzle(null);
        clearSolution();
    }

    useAsync(async () => {
        async function loadPuzzle() {
            try {
                let puzzleSlug = puzzleSlugFromRoute;
                if (!puzzleSlug) {
                    puzzleSlug = await getDefaultPuzzleSlug();
                }

                if (!puzzleSlug) {
                    clearPuzzle();
                    return null;
                }

                const puzzle = await getPuzzleBySlug(puzzleSlug);
                setCurrentPuzzle(puzzle);

                if (!puzzle) {
                    clearPuzzle();
                    return null;
                }

                return puzzle;
            } catch (e) {
                console.error(e);
                clearPuzzle();
                return null;
            }
        }

        async function loadSolution(puzzleId: string, date: CalendarDate) {
            try {
                const solution = await getPuzzleSolution(puzzleId, asDateOnly(date));
                if (!solution) {
                    clearSolution();
                    return null;
                }
                setCurrentSolution(solution);
                return solution;
            } catch(e) {
                console.error(e);
                clearSolution();
                return null;
            }
        }

        async function loadUserSolution(puzzleId: string, solutionWord: string,
                                        maxGuesses: number,
                                        solutionId: string, userId: string | null | undefined) {
            const defaultUserSolution = {
                solutionId: solutionId,
                userId: userId,
                guesses: [],
                state: "Unsolved",
                hardMode: false,
                solutionWord: solutionWord,
                solutionDate: selectedDate,
                maxGuesses: maxGuesses,
                puzzleId: puzzleId
            } as IUserPuzzleSolution;

            try {
                const userSolution = (solution && userId) ?
                    await getUserSolution(userId, solutionId) ?? defaultUserSolution : defaultUserSolution;
                setCurrentUserSolution(userSolution);
                return userSolution;
            }
            catch (e) {
                console.error(e);
                setCurrentUserSolution(defaultUserSolution);
                return defaultUserSolution;
            }

        }

        if (!isLoading || !isMounted() || sessionStatus === "loading") return;

        const puzzle = await loadPuzzle();

        if (!puzzle) {
            setIsLoading(false);
            return;
        }

        // Disallow playing tomorrow's game today.
        if (selectedDate.compare(localToday) > 0) {
            router.replace(`/${puzzle.slug}`);
            return;
        }

        const solution = await loadSolution(puzzle.id, selectedDate);
        if (!solution) {
            setIsLoading(false);
            return;
        }

        await loadUserSolution(puzzle.id, solution.solution, solution.maxGuesses, solution.id, session?.user?.id);

        const neighboringSolutions = puzzle?.id ?
            await getPuzzleNeighboringSolutions(puzzle.id, asDateOnly(selectedDate)) :
            {previous: null, next: null};

        const prevDate = neighboringSolutions.previous ? new CalendarDate(
            neighboringSolutions.previous.date.getUTCFullYear(),
            neighboringSolutions.previous.date.getUTCMonth() + 1,
            neighboringSolutions.previous.date.getUTCDate()) : null;
        setPreviousPuzzleDate(prevDate);

        const nextDate = neighboringSolutions.next ? new CalendarDate(
            neighboringSolutions.next.date.getUTCFullYear(),
            neighboringSolutions.next.date.getUTCMonth() + 1,
            neighboringSolutions.next.date.getUTCDate()) : null;
        if (nextDate && localToday.compare(nextDate) >= 0)
            setNextPuzzleDate(nextDate);

        setIsLoading(false);
    }, [isLoading, sessionStatus]);

    if (isLoading) return <PuzzlePageSkeleton/>;
    if (!currentPuzzle) return notFound();
    if (!currentSolution) return <NoSolution puzzle={currentPuzzle} date={selectedDate}/>

    return (
        <>
            <GamePanelHeader
                currentPuzzle={currentPuzzle}
                currentSolution={currentSolution}
                previousPuzzleDate={previousPuzzleDate}
                nextPuzzleDate={nextPuzzleDate}
                selectedDate={selectedDate}/>
            {currentUserSolution && <GamePanel
                puzzle={currentPuzzle}
                solution={currentSolution}
                initialUserSolution={currentUserSolution}
            />}
        </>
    );
}