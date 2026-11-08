"use client";

import {StatsIcon} from "@/components/icons";
import HeaderIcon from "@/components/header/HeaderIcon";
import BaseModal from "@/components/modal/ModalBase";
import {useDisclosure, Skeleton} from "@heroui/react";
import StatBar from "@/components/statbar";
import {useCurrentPuzzle} from "@/providers/PuzzleProvider";
import {PuzzleStats} from "@/types";
import {listLocalUserSolutions} from "@/lib/local-solutions";
import {useEffect, useState} from "react";
import Countdown from "react-countdown";
import {useSettings} from "@/providers/SettingsProvider";
import Histogram from "@/components/histogram";
import {useAsync} from "react-use";
import {fromDate, toCalendarDate, DateFormatter, getLocalTimeZone, today, CalendarDate} from "@internationalized/date";
import {getUserPuzzleStats} from "@/lib/user-service";
import {useSession} from "next-auth/react";
import {buildStats} from "@/lib/stats";
import ShareButton from "@/components/sharebutton";
import {asDateOnly} from "@/lib/date-util";
import {solutionExists} from "@/lib/puzzle-service";
import {useGlobalModal} from "@/providers/GlobalModalProvider";

type Props = {
    appTitle: string
}

export default function RankingModal({appTitle}: Props) {
    const { data: session, status: sessionStatus } = useSession();
    const {isOpen, onOpen, onOpenChange} = useGlobalModal("ranking", useDisclosure())!;
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

    useAsync(async () => {
        if (!isOpen) return;
        setIsLoading(true);
        if (sessionStatus === "loading") return;

        if (currentPuzzle) {
            const tomorrowHasSolution = await solutionExists(currentPuzzle.id, asDateOnly(tomorrow));
            setHasNextGame(tomorrowHasSolution);
        }

        if (!currentPuzzle?.id) return;

        if (session?.user?.id) {
            setPuzzleStats(await getUserPuzzleStats(session.user.id, currentPuzzle.id));
        } else {
            const userSolutions = listLocalUserSolutions(currentPuzzle.id)
                .filter(userSolution => userSolution.state !== "Unsolved");
            setPuzzleStats(buildStats(userSolutions));
        }
        setIsLoading(false);
    }, [currentUserSolution, isOpen, sessionStatus]);

    if (!currentPuzzle) return null;

    return (
        <>
            <HeaderIcon label="Statistics" onPress={onOpen}>
                <StatsIcon/>
            </HeaderIcon>

            <BaseModal title="Statistics" isOpen={isOpen} onOpenChange={onOpenChange}>
                <Skeleton className="skeleton rounded-[22px]" isLoaded={!isLoading}>
                    <StatBar puzzleStats={puzzleStats}/>
                </Skeleton>
                <Skeleton className="skeleton" isLoaded={!isLoading}>
                    {puzzleStats.totalGames > 0 && (
                        <div className="flex flex-col gap-[18px]">
                            <div className="flex flex-col gap-2">
                                <h3 className="mb-1 text-xs font-semibold tracking-[0.08em] text-fg-sub uppercase">
                                    Guess Distribution
                                </h3>
                                <Histogram
                                    isLatestGame={isLatestGame}
                                    puzzleStats={puzzleStats}
                                    isGameWon={currentUserSolution?.state === "Win"}
                                    numberOfGuessesMade={currentUserSolution?.guesses.length ?? 0}
                                />
                            </div>
                            {currentSolution && currentUserSolution && currentUserSolution.state !== "Unsolved" && (
                                <>
                                    {(isLatestGame && hasNextGame) && (
                                        <div className="-mb-1.5 flex items-baseline justify-center gap-2.5">
                                            <span className="text-sm font-medium text-fg-sub">New word in</span>
                                            <Countdown
                                                className="text-xl font-bold tracking-[0.02em] text-fg tabular-nums"
                                                date={tomorrow.toDate(userTimeZone)}
                                                daysInHours={true}
                                            />
                                        </div>
                                    )}
                                    {(!isLatestGame && solutionDate) && (
                                        <div className="-mb-1.5 flex items-baseline justify-center gap-2.5">
                                            <span className="text-sm font-medium text-fg-sub">Game date</span>
                                            <span className="text-base font-bold text-fg">
                                                {dateFormatter.format(solutionDate.toDate(userTimeZone))}
                                            </span>
                                        </div>
                                    )}
                                    <ShareButton appTitle={appTitle}
                                                 currentPuzzle={currentPuzzle}
                                                 currentUserSolution={currentUserSolution}
                                                 currentSolution={currentSolution}
                                                 isHighContrast={settings.isHighContrast}
                                                 isHardMode={settings.isHardMode}
                                                 isDarkMode={settings.isDarkMode}
                                    />
                                </>
                            )}
                        </div>
                    )}
                </Skeleton>
            </BaseModal>
        </>
    )
}