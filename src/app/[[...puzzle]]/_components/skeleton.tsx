"use client";

import GameGrid from "@/components/game/grid";
import Keyboard from "@/components/game/keyboard";
import {initRows} from "@/lib/guesses";
import {Skeleton} from "@nextui-org/react";

export function PuzzlePageSkeleton() {
    const rows = initRows(6, 5);
    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <Skeleton className="skeleton w-[225px] h-[30px] mb-1"/>
                <Skeleton className="skeleton w-[250px] h-[25px]"/>
            </div>

            <div
                className="mx-auto flex w-full grow flex-col px-1 pb-2 sm:px-6 md:max-w-7xl lg:px-8 short:pb-2 pt-2 short:pt-2">
                <div className="flex grow flex-col">
                    <GameGrid
                        isLoading={true}
                        currentRowClassName=""
                        rows={rows}
                        isRevealing={false}
                        currentRowIndex={0}
                    />
                    <Keyboard
                        disabled={true}
                        onLetterClick={() => {}}
                        onSubmit={() => {}}
                        onDelete={() => {}}
                        solution="     "
                        rows={rows.slice(0, 0)}
                        isRevealing={false}
                    />
                </div>
            </div>
            </>
            )


            //return (
            // <div className="flex flex-col items-center justify-center h-[25vh]">
            // <h2 className="text-xl sm:text-2xl font-bold text-nowrap dark:text-white">
            // Loading Puzzle...
            // </h2>
            // </div>
            //)
            }