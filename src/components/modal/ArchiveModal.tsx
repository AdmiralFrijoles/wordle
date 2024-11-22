"use client";

import {CalendarDaysIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";
import {useCurrentPuzzle} from "@/providers/PuzzleProvider";
import {useEffect, useState} from "react";
import BaseModal from "@/components/modal/ModalBase";
import {useDisclosure} from "@nextui-org/use-disclosure";
import {Calendar} from "@nextui-org/react";
import {DateValue, getLocalTimeZone, today, CalendarDate} from "@internationalized/date";
import {useAsync} from "react-use";
import {listDatesForPuzzle} from "@/lib/puzzle-service";
import {useRouter} from "next/navigation";

export default function ArchiveModal() {
    const {currentPuzzle, currentSolution} = useCurrentPuzzle();
    const {isOpen, onOpen, onClose, onOpenChange} = useDisclosure();
    const [selectedDate, setSelectedDate] = useState<DateValue>(today(getLocalTimeZone()));
    const [availableDates, setAvailableDates] = useState<DateValue[]>([]);
    const [minDate, setMinDate] = useState<DateValue>(today(getLocalTimeZone()));
    const [maxDate, setMaxDate] = useState<DateValue>(today(getLocalTimeZone()));
    const [isLoadingDates, setIsLoadingDates] = useState(true);
    const router = useRouter();

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
        if (!currentPuzzle) {
            setIsLoadingDates(false);
            return;
        }

        if (isOpen) {
            setIsLoadingDates(true);
            const dates = await listDatesForPuzzle(currentPuzzle.id);
            const tmpDates = dates.map(date => {
                return new CalendarDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
            });
            if (tmpDates.length > 0) {
                setAvailableDates(tmpDates);
                setMinDate(tmpDates[0]);
                setMaxDate(tmpDates[dates.length - 1])
            } else {
                setAvailableDates([]);
                setMinDate(today(getLocalTimeZone()));
                setMaxDate(today(getLocalTimeZone()))
            }
            setIsLoadingDates(false);
        } else {
            setAvailableDates([]);
        }
    }, [isOpen])

    function isDateUnavailable(date: DateValue): boolean {
        if (date.compare(minDate) < 0 || date.compare(maxDate) > 0) return false;
        return !availableDates.some(d => date.compare(d) === 0);
    }

    function onDateSelected(date: DateValue) {
        if (!currentPuzzle) return;
        setSelectedDate(date);
        router.push(`/${currentPuzzle.slug}/${date.year}/${date.month}/${date.day}`)
        onClose();
    }

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
                                aria-label="Available Puzzle Solution Dates"
                                calendarWidth="w-full"
                                value={selectedDate}
                                minValue={minDate}
                                maxValue={maxDate}
                                onChange={onDateSelected}
                                isDateUnavailable={isDateUnavailable}
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