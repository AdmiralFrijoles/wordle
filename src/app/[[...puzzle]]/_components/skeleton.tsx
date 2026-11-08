"use client";

import GameGrid from "@/components/game/grid";
import Keyboard from "@/components/game/keyboard";
import {initRows} from "@/lib/guesses";
import {Skeleton} from "@heroui/react";

export function PuzzlePageSkeleton() {
    const rows = initRows(6, 5);
    return (
        <>
            <Skeleton className="skeleton h-[86px] rounded-[20px] sm:h-[92px] sm:rounded-[22px]"/>
            <div className="flex w-full grow flex-col">
                <div className="mt-2.5 min-h-[34px] sm:mt-4"/>
                <div className="flex grow flex-col gap-4 sm:gap-6">
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
}
