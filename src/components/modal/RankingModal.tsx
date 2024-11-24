"use client";

import {ChartBarIcon, ClockIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";
import BaseModal from "@/components/modal/ModalBase";
import {useDisclosure} from "@nextui-org/use-disclosure";
import StatBar from "@/components/statbar";
import {useCurrentPuzzle} from "@/providers/PuzzleProvider";
import {IUserPuzzleSolution, PuzzleStats} from "@/types";
import {useEffect, useState} from "react";
import Countdown from "react-countdown";
import {useSettings} from "@/providers/SettingsProvider";
import Histogram from "@/components/histogram";
import {useAsync, useDebounce} from "react-use";
import {fromDate, toCalendarDate, DateFormatter, getLocalTimeZone, today, CalendarDate} from "@internationalized/date";
import {getUserPuzzleStats} from "@/lib/user-service";
import {useSession} from "next-auth/react";
import {buildStats} from "@/lib/stats";
import ShareButton from "@/components/sharebutton";
import {asDateOnly} from "@/lib/date-util";
import {solutionExists} from "@/lib/puzzle-service";

type Props = {
    appTitle: string
}

export default function RankingModal({appTitle}: Props) {
    const { data: session, status: sessionStatus } = useSession();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {currentPuzzle, currentSolution, currentUserSolution} = useCurrentPuzzle();
    const [isLatestGame, setIsLatestGame] = useState(false);
    const [solutionDate, setSolutionDate] = useState<CalendarDate>();
    const settings = useSettings();
    const userTimeZone = getLocalTimeZone();
    const numberFormat = new Intl.NumberFormat();
    const userLocale = numberFormat.resolvedOptions().locale;
    const localToday = today(userTimeZone);
    const dateFormatter = new DateFormatter(userLocale, {dateStyle: "medium"});
    const tomorrow = localToday.add({days: 1});
    const [isLoading, setIsLoading] = useState(true);
    const [puzzleStats, setPuzzleStats] = useState<PuzzleStats>({
        currentStreak: 0,
        successRate: 0,
        totalGames: 0,
        bestStreak: 0,
        gamesFailed: 0,
        winDistribution: []
    });
    const [hasNextGame, setHasNextGame] = useState(false);

    useEffect(() => {
        if (currentSolution) {
            const date = toCalendarDate(fromDate(currentSolution.date, "Etc/UTC"));
            setSolutionDate(date);
            setIsLatestGame(localToday.compare(date) === 0);
        } else {
            setSolutionDate(undefined);
            setIsLatestGame(false);
        }
    }, [currentSolution]);

    useDebounce(() => {
        if (!currentUserSolution) return;

        if (currentUserSolution.state !== "Unsolved") {
            onOpen();
        }
    }, 100, [currentUserSolution]);

    useAsync(async () => {
        if (!isOpen) return;
        setIsLoading(true);
        if (sessionStatus === "loading") return;

        if (currentPuzzle) {
            const tomorrowHasSolution = await solutionExists(currentPuzzle.id, asDateOnly(tomorrow));
            setHasNextGame(tomorrowHasSolution);
        }

        if (session?.user?.id && currentPuzzle?.id) {
            setPuzzleStats(await getUserPuzzleStats(session.user.id, currentPuzzle.id));
        } else {
            const userSolutions: IUserPuzzleSolution[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith("user-solution-")) {
                    const localStorageValue = localStorage.getItem(key);
                    if (!localStorageValue) continue;
                    const userSolution = JSON.parse(localStorageValue) as IUserPuzzleSolution;
                    userSolutions.push(userSolution);
                }
            }
            setPuzzleStats(buildStats(userSolutions));
        }
        setIsLoading(false);
    }, [currentUserSolution, isOpen, sessionStatus]);

    if (!currentPuzzle) return null;

    return (
        <>
            <HeaderIcon tooltipContent="Stats & Ranking">
                <ChartBarIcon className="dark:stroke-white" onClick={onOpen}/>
            </HeaderIcon>

            <BaseModal title="Statistics" isOpen={isOpen} onOpenChange={onOpenChange}>
                {isLoading ?
                    (<p>Loading...</p>) :
                    (<div className="text-center">
                        <StatBar puzzleStats={puzzleStats}/>
                        {puzzleStats.totalGames > 0 && (
                            <>
                            <h4 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
                                Guess Distribution
                            </h4>
                            <Histogram
                                isLatestGame={isLatestGame}
                                puzzleStats={puzzleStats}
                                isGameWon={currentUserSolution?.state === "Win"}
                                numberOfGuessesMade={currentUserSolution?.guesses.length ?? 0}
                            />
                            {currentSolution && currentUserSolution && currentUserSolution.state !== "Unsolved" && (
                                <div>
                                    <div
                                        className="items-center justify-center text-center dark:text-white">
                                        <div className="inline-block w-full text-left">
                                            {(isLatestGame && hasNextGame) && (
                                                <div>
                                                    <strong>New word in:&nbsp;</strong>
                                                    <Countdown
                                                        className="inline-flex text-lg font-medium text-gray-900 dark:text-gray-100"
                                                        date={tomorrow.toDate(userTimeZone)}
                                                        daysInHours={true}
                                                    />
                                                </div>
                                            )}
                                            {(!isLatestGame && solutionDate) && (
                                                <div className="mt-2 inline-flex w-full">
                                                    <ClockIcon
                                                        className="mr-1 mt-2 h-5 w-5 stroke-black dark:stroke-white"/>
                                                    <div className="inline-flex mt-1 ml-1 text-center text-sm sm:text-base">
                                                        <strong>Game date:&nbsp;</strong>
                                                        <p>{dateFormatter.format(solutionDate.toDate(userTimeZone))}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full mt-4">
                                        <ShareButton appTitle={appTitle}
                                                     currentPuzzle={currentPuzzle}
                                                     currentUserSolution={currentUserSolution}
                                                     currentSolution={currentSolution}
                                                     isHighContrast={settings.isHighContrast}
                                                     isHardMode={settings.isHardMode}
                                                     isDarkMode={settings.isDarkMode}
                                        />
                                    </div>
                                </div>
                            )}
                            </>
                        )}
                    </div>)}
            </BaseModal>
        </>
    )
}