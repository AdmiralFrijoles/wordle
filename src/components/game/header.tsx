"use client";

import {Tooltip} from "@nextui-org/react";
import Link from "next/link";
import PuzzleLinkButton from "@/components/PuzzleLinkButton";
import {format} from "date-fns";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/16/solid";
import {Puzzle, Solution} from "@prisma/client";
import {CalendarDate, DateFormatter, getLocalTimeZone} from "@internationalized/date";

type Props = {
    currentPuzzle: Puzzle
    currentSolution: Solution
    previousPuzzleDate: CalendarDate | null
    nextPuzzleDate: CalendarDate | null
    selectedDate: CalendarDate
}

export function GamePanelHeader({currentPuzzle, currentSolution, previousPuzzleDate, nextPuzzleDate, selectedDate}: Props) {
    const userTimeZone = getLocalTimeZone();
    const userLocale = (new Intl.NumberFormat()).resolvedOptions().locale;
    const dateFormatter = new DateFormatter(userLocale, {dateStyle: "full"});

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
                <Tooltip content={currentPuzzle.description} delay={300} placement="bottom">
                    <Link href={`/${currentPuzzle.slug}`}>
                        <h2 className="text-lg font-semibold dark:text-white">{currentPuzzle.title}</h2>
                    </Link>
                </Tooltip>
                {currentSolution && <PuzzleLinkButton
                    link={`/${currentPuzzle.slug}/${format(selectedDate.toDate(userTimeZone), "yyyy/MM/dd")}`}/>}
            </div>
            <div className="flex tems-center justify-center">
                {previousPuzzleDate && <div className="flex flex-1 justify-start">
                    <Tooltip delay={500} content={(<p className="text-center">Previous
                        Solution<br/>{dateFormatter.format(previousPuzzleDate.toDate(userTimeZone))}</p>)}>
                        <Link
                            href={`/${currentPuzzle.slug}/${format(previousPuzzleDate.toDate(userTimeZone), "yyyy/MM/dd")}`}>
                            <ChevronLeftIcon className="w-5 -ml-5"/>
                        </Link>
                    </Tooltip>
                </div>}
                <h3 className="flex grow justify-center px-2 text-sm dark:text-white">{dateFormatter.format(selectedDate.toDate(userTimeZone))}</h3>
                {nextPuzzleDate && <div className="flex flex-1 justify-end">
                    <Tooltip delay={500} content={(<p className="text-center">Next
                        Solution<br/>{dateFormatter.format(nextPuzzleDate.toDate(userTimeZone))}</p>)}>
                        <Link
                            href={`/${currentPuzzle.slug}/${format(nextPuzzleDate.toDate(userTimeZone), "yyyy/MM/dd")}`}>
                            <ChevronRightIcon className="w-5 -mr-5"/>
                        </Link>
                    </Tooltip>
                </div>}
            </div>
        </div>
    )
}