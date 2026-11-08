"use client";

import {useCurrentPuzzle} from "@/providers/PuzzleProvider";
import {useEffect, useState} from "react";
import BaseModal from "@/components/modal/ModalBase";
import {useDisclosure, Skeleton} from "@heroui/react";
import {getLocalTimeZone, today, CalendarDate} from "@internationalized/date";
import {useAsync} from "react-use";
import {listDatesForPuzzle} from "@/lib/puzzle-service";
import {getUserSolutionDates} from "@/lib/user-service";
import {listLocalUserSolutions} from "@/lib/local-solutions";
import {useRouter} from "next/navigation";
import {useSession} from "next-auth/react";
import {useGlobalModal} from "@/providers/GlobalModalProvider";
import ResultCalendar, {dateKey, DayResult} from "@/components/archive/ResultCalendar";

async function loadResults(puzzleId: string, isSignedIn: boolean): Promise<Map<string, DayResult>> {
    const results = new Map<string, DayResult>();
    if (isSignedIn) {
        for (const entry of await getUserSolutionDates(puzzleId)) {
            results.set(dateKey(entry.date), entry.state);
        }
    } else {
        for (const solution of listLocalUserSolutions(puzzleId)) {
            const date = solution.solutionDate;
            if (date) {
                // Saved games store a zero based month.
                results.set(dateKey({year: date.year, month: date.month + 1, day: date.day}), solution.state);
            }
        }
    }
    return results;
}

export default function ArchiveModal() {
    const {data: session, status: sessionStatus} = useSession();
    const {currentPuzzle, currentSolution} = useCurrentPuzzle();
    const disclosure = useDisclosure();
    useGlobalModal("archive", disclosure);
    const {isOpen, onClose, onOpenChange} = disclosure;
    const localToday = today(getLocalTimeZone());
    const [selectedDate, setSelectedDate] = useState<CalendarDate>(localToday);
    const [availableDates, setAvailableDates] = useState<Set<string>>(new Set());
    const [results, setResults] = useState<Map<string, DayResult>>(new Map());
    const [minDate, setMinDate] = useState<CalendarDate>(localToday);
    const [maxDate, setMaxDate] = useState<CalendarDate>(localToday);
    const [isLoadingDates, setIsLoadingDates] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!currentPuzzle || !currentSolution) {
            onClose();
        } else {
            setSelectedDate(new CalendarDate(
                currentSolution.date.getUTCFullYear(),
                currentSolution.date.getUTCMonth() + 1,
                currentSolution.date.getUTCDate()));
        }
    }, [currentPuzzle, currentSolution, onClose]);

    useAsync(async () => {
        if (!isOpen || sessionStatus === "loading") {
            return;
        }

        if (!currentPuzzle) {
            setIsLoadingDates(false);
            return;
        }

        setIsLoadingDates(true);
        const [dates, dayResults] = await Promise.all([
            listDatesForPuzzle(currentPuzzle.id),
            loadResults(currentPuzzle.id, !!session?.user?.id).catch(e => {
                console.error("Failed to load results:", e);
                return new Map<string, DayResult>();
            }),
        ]);
        const calendarDates = dates.map(date =>
            new CalendarDate(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()));

        setAvailableDates(new Set(calendarDates.map(dateKey)));
        setResults(dayResults);
        if (calendarDates.length > 0) {
            const lastDate = calendarDates[calendarDates.length - 1];
            setMinDate(calendarDates[0]);
            setMaxDate(lastDate.compare(localToday) > 0 ? localToday : lastDate);
        } else {
            setMinDate(localToday);
            setMaxDate(localToday);
        }
        setIsLoadingDates(false);
    }, [isOpen, sessionStatus])

    function onDateSelected(date: CalendarDate) {
        if (!currentPuzzle) {
            return;
        }
        setSelectedDate(date);
        router.push(`/${currentPuzzle.slug}/${date.year}/${date.month}/${date.day}`)
        onClose();
    }

    if (!currentPuzzle) {
        return null;
    }

    return (
        <BaseModal title="Choose Solution Date" isOpen={isOpen} onOpenChange={onOpenChange}>
            {isLoadingDates ?
                <Skeleton className="skeleton h-[400px] rounded-[20px]"/> :
                <ResultCalendar
                    value={selectedDate}
                    minValue={minDate}
                    maxValue={maxDate}
                    availableDates={availableDates}
                    results={results}
                    onSelect={onDateSelected}
                />}
        </BaseModal>
    )
}
