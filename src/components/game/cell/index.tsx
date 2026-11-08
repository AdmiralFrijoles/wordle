import {CharStatus} from "@/types";
import classnames from "classnames";
import {REVEAL_TIME_MS} from "@/constants";
import {Skeleton} from "@heroui/react";

type Props = {
    value?: string;
    status?: CharStatus;
    position?: number;
    isRevealing?: boolean;
    isCompleted?: boolean;
    isActive?: boolean;
    isLoading?: boolean | undefined;
    size?: "board" | "small";
};

export default function GameGridCell({value, status, position = 0, isRevealing, isCompleted, isActive, isLoading, size = "board"}: Props) {
    const isFilled = value && !isCompleted
    const shouldReveal = isRevealing && isCompleted
    const animationDelay = `${isCompleted ? position * REVEAL_TIME_MS : 0}ms`
    const isGuessing = !status || status === "Guessing";

    const sizeClasses = size === "small"
        ? "h-10 w-10 rounded-[9px] text-xl"
        : "size-[var(--tile)] rounded-xl text-[calc(var(--tile)*0.48)] sm:rounded-[14px]";

    const classes = classnames(
        'prevent-select box-border flex items-center justify-center border-[1.5px] font-bold',
        sizeClasses,
        {
            'tile-empty': isGuessing && !value && !isActive,
            'tile-active': isGuessing && !value && isActive,
            'tile-typed': isGuessing && !!value,
            'tile-absent absent': status === 'Absent',
            'hit-correct correct': status === 'Correct',
            'hit-present present': status === 'Present',
            'cell-fill-animation': isFilled,
            'cell-reveal': shouldReveal,
        }
    )

    return (
        <>
            {isLoading ?
                <Skeleton className={classnames("skeleton", sizeClasses)}/> :
                <div className={classes} style={{animationDelay}}>
                    <div className="letter-container" style={{animationDelay}}>
                        {value}
                    </div>
                </div>
            }
        </>
    )
}
