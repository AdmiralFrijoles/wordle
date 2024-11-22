"use client";

import {ChartBarIcon, ClockIcon, ShareIcon} from "@heroicons/react/24/outline";
import HeaderIcon from "@/components/header/HeaderIcon";
import BaseModal from "@/components/modal/ModalBase";
import {useDisclosure} from "@nextui-org/use-disclosure";
import StatBar from "@/components/statbar";
import {useCurrentPuzzle} from "@/providers/PuzzleProvider";
import {PuzzleStats} from "@/types";
import {compareDesc, startOfToday, addDays, format} from "date-fns";
import {useEffect, useState} from "react";
import Countdown from "react-countdown";
import shareStats from "@/lib/share";
import {useSettings} from "@/providers/SettingsProvider";
import {alertError, alertSuccess} from "@/lib/alerts";
import Histogram from "@/components/histogram";

type Props = {
    appTitle: string
}

export default function RankingModal({appTitle}: Props) {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const {currentPuzzle, currentSolution, currentUserSolution} = useCurrentPuzzle();
    const [isLatestGame, setIsLatestGame] = useState(false);
    const settings = useSettings();
    const today = startOfToday();
    const tomorrow = addDays(today, 1);


    useEffect(() => {
        setIsLatestGame((currentSolution && compareDesc(today, currentSolution.date) === 0) ?? false);
    }, [today, currentSolution]);

    if (!currentPuzzle) return null;

    const puzzleStats: PuzzleStats = {
        puzzle: currentPuzzle,
        currentStreak: 0,
        successRate: 0,
        totalGames: 0,
        bestStreak: 0,
        gamesFailed: 0,
        winDistribution: []
    }

    function handleShareFailure() {
        alertError("Failed to share stats", 5000);
    }

    function handleShareToClipboard() {
        alertSuccess("Game copied to clipboard");
    }

    return (
        <>
            <HeaderIcon tooltipContent="Stats & Ranking">
                <ChartBarIcon className="dark:stroke-white" onClick={onOpen}/>
            </HeaderIcon>

            <BaseModal title="Statistics" isOpen={isOpen} onOpenChange={onOpenChange}>
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
                        <div
                            className="mt-5 columns-2 items-center items-stretch justify-center text-center dark:text-white sm:mt-6">
                            <div className="inline-block w-full text-left">
                                {isLatestGame && (
                                    <div>
                                        <h5>New word in</h5>
                                        <Countdown
                                            className="text-lg font-medium text-gray-900 dark:text-gray-100"
                                            date={tomorrow}
                                            daysInHours={true}
                                        />
                                    </div>
                                )}
                                {!isLatestGame && (
                                    <div className="mt-2 inline-flex">
                                        <ClockIcon className="mr-1 mt-2 mt-1 h-5 w-5 stroke-black dark:stroke-white"/>
                                        <div className="mt-1 ml-1 text-center text-sm sm:text-base">
                                            <strong>Game date:</strong>
                                            <br/>
                                            {format(currentSolution.date, 'd MMMM yyyy')}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-base"
                                    onClick={() => {
                                        shareStats(
                                            appTitle,
                                            currentPuzzle,
                                            currentSolution,
                                            currentUserSolution,
                                            settings.isHardMode,
                                            settings.isDarkMode,
                                            settings.isHighContrast,
                                            handleShareToClipboard,
                                            handleShareFailure
                                        )
                                    }}
                                >
                                    <ShareIcon className="mr-2 h-6 w-6 cursor-pointer dark:stroke-white"/>
                                    Share
                                </button>
                            </div>
                        </div>
                    )}
                    </>
                )}
            </BaseModal>
        </>
    )
}