﻿import {notFound, redirect} from "next/navigation";
import {getDefaultPuzzle, getPuzzleBySlug, getPuzzleSolution} from "@/lib/puzzle-service";
import {Puzzle} from "@prisma/client";
import {startOfToday, format, compareDesc} from "date-fns";
import NoSolution from "@/app/[[...puzzle]]/no-solution";
import GamePanel from "@/components/game";
import {auth} from "@/lib/auth";
import {getUserSolution} from "@/lib/user-service";
import { Tooltip } from "@nextui-org/react";
import PuzzleLinkButton from "@/components/PuzzleLinkButton";
import {IUserPuzzleSolution} from "@/types";

function getPuzzleDateFromRoute(route: string[]): Date {
    const today = startOfToday();
    if (route && route.length >= 4) {
        const year = parseInt(route[1]);
        const month = parseInt(route[2]);
        const day = parseInt(route[3]);

        if (year && month && day) {
            return new Date(year, month - 1, day);
        }
    }
    return today;
}

export default async function Page({params}: {params: Promise<{puzzle: string[]}>}) {
    const session = await auth();
    const routeParams = (await params).puzzle;
    const slug: string | null = routeParams && routeParams.length > 0 ? routeParams[0] : null;
    const date: Date = getPuzzleDateFromRoute(routeParams);
    const today = startOfToday();

    let puzzle: Puzzle | null | undefined;
    if (!slug) {
        puzzle = await getDefaultPuzzle();
    } else {
        puzzle = await getPuzzleBySlug(slug)
    }
    if (!puzzle) {
        return notFound();
    }

    // If the date from the route is in the future (relative to the user's timezone), redirect to the default solution.
    if (compareDesc(today, date) === 1) {
        return redirect(`/${slug}`);
    }

    const solution = await getPuzzleSolution(puzzle.id, date);

    const defaultUserSolution = {
        solutionId: solution?.id,
        userId: session?.user?.id,
        guesses: [],
        state: "Unsolved"
    } as IUserPuzzleSolution;

    const userSolution = (solution && session?.user?.id) ?
        await getUserSolution(session?.user?.id, solution.id) ?? defaultUserSolution : defaultUserSolution;

    return (
        <div>
            <div className="flex grow flex-col items-center justify-center pb-6 short:pb-2">
                <div className="flex items-center justify-center">
                    <Tooltip content={puzzle.description} delay={300}  placement="bottom">
                        <h2 className="text-lg font-semibold dark:text-white">{puzzle.title}</h2>
                    </Tooltip>
                    {solution && <PuzzleLinkButton link={`/${puzzle.slug}/${format(date, "yyyy/MM/dd")}`}/>}
                </div>
                <h3 className="text-sm dark:text-white">{format(date, "PPPP")}</h3>
            </div>
            {solution ?
                <GamePanel puzzle={puzzle} solution={solution} initialUserSolution={userSolution}/> :
                <NoSolution puzzle={puzzle} date={date}/>
            }
        </div>
    )
}