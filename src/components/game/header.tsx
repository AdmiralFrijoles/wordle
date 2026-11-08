"use client";

import React from "react";
import {Tooltip} from "@heroui/react";
import Link from "next/link";
import PuzzleLinkButton from "@/components/PuzzleLinkButton";
import {format} from "date-fns";
import {Puzzle, Solution} from "@prisma/client";
import {CalendarDate, DateFormatter, getLocalTimeZone} from "@internationalized/date";
import {useGlobalModal} from "@/providers/GlobalModalProvider";
import {CalendarIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon} from "@/components/icons";

type Props = {
    currentPuzzle: Puzzle
    currentSolution: Solution
    previousPuzzleDate: CalendarDate | null
    nextPuzzleDate: CalendarDate | null
    selectedDate: CalendarDate
}

const stepClasses = "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-fg-icon transition-colors";

function SolutionStep({puzzle, date, label, children}: {
    puzzle: Puzzle,
    date: CalendarDate | null,
    label: string,
    children: React.ReactNode
}) {
    const userTimeZone = getLocalTimeZone();
    if (!date) {
        return <span aria-hidden="true" className={`${stepClasses} opacity-30`}>{children}</span>;
    }
    return (
        <Link aria-label={label}
              href={`/${puzzle.slug}/${format(date.toDate(userTimeZone), "yyyy/MM/dd")}`}
              className={`${stepClasses} hover:bg-hover hover:text-fg`}>
            {children}
        </Link>
    );
}

export function GamePanelHeader({currentPuzzle, currentSolution, previousPuzzleDate, nextPuzzleDate, selectedDate}: Props) {
    const userTimeZone = getLocalTimeZone();
    const userLocale = (new Intl.NumberFormat()).resolvedOptions().locale;
    const dateFormatter = new DateFormatter(userLocale, {dateStyle: "full"});
    const puzzleModal = useGlobalModal("puzzles");
    const archiveModal = useGlobalModal("archive");

    const title = (
        <span className="truncate text-[17px] font-bold tracking-[-0.01em] text-fg sm:text-lg">
            {currentPuzzle.title}
        </span>
    );

    return (
        <section aria-label="Puzzle" className="glass flex items-center rounded-[20px] px-1 py-2 sm:rounded-[22px] sm:px-1.5 sm:py-2.5">
            <SolutionStep puzzle={currentPuzzle} date={previousPuzzleDate} label="Previous solution">
                <ChevronLeftIcon size={20}/>
            </SolutionStep>
            <div className="flex min-w-0 flex-1 flex-col items-center">
                <div className="flex max-w-full items-center">
                    <Tooltip content={currentPuzzle.description} delay={300} closeDelay={0} placement="bottom"
                             isDisabled={!currentPuzzle.description}>
                        {puzzleModal ?
                            <button type="button" onClick={puzzleModal.onOpen}
                                    className="flex h-9 min-w-0 cursor-pointer items-center gap-1 rounded-[10px] pr-1.5 pl-2.5 transition-colors hover:bg-hover">
                                {title}
                                <ChevronDownIcon size={16} className="shrink-0 text-fg-sub"/>
                            </button> :
                            <span className="flex h-9 min-w-0 items-center px-2.5">{title}</span>}
                    </Tooltip>
                    {currentSolution && <PuzzleLinkButton
                        link={`/${currentPuzzle.slug}/${format(selectedDate.toDate(userTimeZone), "yyyy/MM/dd")}`}/>}
                </div>
                <button type="button" aria-label="Choose solution date" onClick={archiveModal?.onOpen}
                        className="flex h-[30px] cursor-pointer items-center gap-1.5 rounded-[10px] px-2.5 text-[13px] font-medium text-fg-sub transition-colors hover:bg-hover hover:text-fg sm:text-sm">
                    <CalendarIcon size={14}/>
                    {dateFormatter.format(selectedDate.toDate(userTimeZone))}
                </button>
            </div>
            <SolutionStep puzzle={currentPuzzle} date={nextPuzzleDate} label="Next solution">
                <ChevronRightIcon size={20}/>
            </SolutionStep>
        </section>
    )
}
