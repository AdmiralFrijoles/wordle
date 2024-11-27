"use client";

import {CalendarDaysIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";
import {useCurrentPuzzle} from "@/providers/PuzzleProvider";
import {useEffect, useRef, useState} from "react";
import BaseModal from "@/components/modal/ModalBase";
import {useDisclosure} from "@nextui-org/use-disclosure";
import {Calendar} from "@nextui-org/react";
import {DateValue, getLocalTimeZone, today, CalendarDate} from "@internationalized/date";
import {useAsync} from "react-use";
import {listDatesForPuzzle} from "@/lib/puzzle-service";
import {useRouter} from "next/navigation";
import {getUserSolutionDates} from "@/lib/user-service";
import {useSession} from "next-auth/react";
import {GameStates, IUserPuzzleSolution, IUserSolutionDate} from "@/types";

export default function ArchiveModal() {
    const {data: session, status: sessionStatus} = useSession();
    const {currentPuzzle, currentSolution} = useCurrentPuzzle();
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
    const [selectedDate, setSelectedDate] = useState<DateValue>(today(getLocalTimeZone()));
    const [availableDates, setAvailableDates] = useState<DateValue[]>([]);
    const [minDate, setMinDate] = useState<DateValue>(today(getLocalTimeZone()));
    const [maxDate, setMaxDate] = useState<DateValue>(today(getLocalTimeZone()));
    const [userSolutionDates, setUserSolutionDates] = useState<IUserSolutionDate[]>([]);
    const [isLoadingDates, setIsLoadingDates] = useState(true);
    const router = useRouter();
    const userTimeZone = getLocalTimeZone();
    const localToday = today(userTimeZone);
    const calendarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!currentPuzzle || !currentSolution)
            onClose();
        else
            setSelectedDate(new CalendarDate(
                currentSolution.date.getUTCFullYear(),
                currentSolution.date.getUTCMonth() + 1,
                currentSolution.date.getUTCDate()));
    }, [currentPuzzle, currentSolution, onClose]);

    useAsync(async () => {
        if (!isOpen || sessionStatus === "loading") return;

        async function getUserSolutionDatesForPuzzle(puzzleId: string) {
            if (session?.user?.id) {
                return await getUserSolutionDates(puzzleId);
            } else {
                const userSolutions: IUserSolutionDate[] = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key?.startsWith("user-solution-")) {
                        const localStorageValue = localStorage.getItem(key);
                        if (!localStorageValue) continue;
                        const userSolution = JSON.parse(localStorageValue) as IUserPuzzleSolution;
                        if (userSolution.state === "Unsolved") continue;
                        if (userSolution.puzzleId !== puzzleId) continue;
                        userSolutions.push({
                            date: userSolution.solutionDate,
                            state: userSolution.state
                        });
                    }
                }
                return userSolutions;
            }
        }

        if (!currentPuzzle) {
            setIsLoadingDates(false);
            return;
        }

        if (isOpen) {
            setIsLoadingDates(true);
            const userSolutionDates = await getUserSolutionDatesForPuzzle(currentPuzzle.id);
            setUserSolutionDates(userSolutionDates);
            const dates = await listDatesForPuzzle(currentPuzzle.id);
            const tmpDates = dates.map(date => {
                return new CalendarDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
            });
            if (tmpDates.length > 0) {
                setAvailableDates(tmpDates);
                setMinDate(tmpDates[0]);
                let tmpMaxDate = tmpDates[dates.length - 1];
                if (tmpMaxDate.compare(localToday) > 0) {
                    tmpMaxDate = localToday;
                }
                setMaxDate(tmpMaxDate);
            } else {
                setAvailableDates([]);
                setMinDate(today(userTimeZone));
                setMaxDate(today(userTimeZone))
            }
            setIsLoadingDates(false);
        } else {
            setAvailableDates([]);
            setUserSolutionDates([]);
        }
    }, [isOpen, sessionStatus])

    function isDateUnavailable(date: DateValue): boolean {
        if (date.compare(minDate) < 0 || date.compare(maxDate) > 0) return false;
        return !availableDates.some(d => date.compare(d) === 0);
    }

    function getDateSolutionState(date: DateValue): keyof typeof GameStates {
        return userSolutionDates.find(x =>
            x.date.year === date.year &&
            x.date.month === date.month &&
            x.date.day === date.day
        )?.state ?? "Unsolved";
    }

    function onDateSelected(date: DateValue) {
        if (!currentPuzzle) return;
        setSelectedDate(date);
        router.push(`/${currentPuzzle.slug}/${date.year}/${date.month}/${date.day}`)
        onClose();
    }

    // This is an ugly hack to set date colors until NextUI Calendar supports custom cell rendering.
    function setDateCellColors(date?: CalendarDate | undefined) {
        if (!calendarRef || isLoadingDates) return;
        const relativeDate = date ?? selectedDate;
        const elems = calendarRef.current?.querySelectorAll("td[data-slot='cell']>span[role='button']>span");
        if (!elems) return;
        for (let i = 0; i < elems.length; i++) {
            const elem = elems[i];
            if (elem.parentElement!.hasAttribute("data-outside-month") || elem.parentElement!.hasAttribute("data-selected")) continue;
            if (!elem.textContent) return;
            const day = parseInt(elem.textContent);
            if (!day) continue;
            const state = getDateSolutionState(new CalendarDate(
                relativeDate.year,
                relativeDate.month,
                day
            ));
            if (state === "Loss") {
                elem.parentElement!.classList.add("bg-red-600");
                elem.parentElement!.classList.add("text-white");
                elem.parentElement!.classList.add("dark:bg-red-700");
                elem.parentElement!.classList.remove("data-[selected=true]:bg-primary");
                elem.parentElement!.classList.remove("data-[hover=true]:text-primary-400");
            } else if (state == "Win") {
                elem.parentElement!.classList.add("bg-green-600");
                elem.parentElement!.classList.add("text-white");
                elem.parentElement!.classList.add("dark:bg-green-700");
                elem.parentElement!.classList.remove("data-[selected=true]:bg-primary");
                elem.parentElement!.classList.remove("data-[hover=true]:text-primary-400");
            }
        }
    }

    useEffect(() => {
        setDateCellColors();
    }, [calendarRef, isLoadingDates, selectedDate]);

    return (
        <>
            {currentPuzzle && (
                <>
                    <HeaderIcon tooltipContent="Play Previous Words">
                        <CalendarDaysIcon className="dark:stroke-white" onClick={onOpen}/>
                    </HeaderIcon>

                    <BaseModal title="Choose Solution Date" isOpen={isOpen} onOpenChange={onOpenChange}>
                        {isLoadingDates ? <p>Loading...</p> :
                            <Calendar
                                ref={calendarRef}
                                aria-label="Available Puzzle Solution Dates"
                                calendarWidth="w-full"
                                value={selectedDate}
                                minValue={minDate}
                                maxValue={maxDate}
                                onFocusChange={setDateCellColors}
                                onChange={onDateSelected}
                                isDateUnavailable={isDateUnavailable}
                                hideDisabledDates={true}
                                classNames={{
                                    base: "w-full rounded text-base shadow-none border-none text-lg dark:bg-transparent",
                                    cell: "p-0",
                                    cellButton: "m-1",
                                    gridHeaderCell: "m-1",
                                    title: "text-lg",
                                    headerWrapper: "bg-white dark:bg-transparent",
                                    gridHeader: "bg-white dark:bg-transparent shadow-none",
                                    content: "bg-white dark:bg-transparent"
                                }}
                            />
                        }
                    </BaseModal>
                </>
            )}
        </>
    )
}