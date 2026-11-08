import {CharStatus} from "@/types";
import classnames from "classnames";
import {REVEAL_TIME_MS} from "@/constants";
import {Skeleton} from "@heroui/react";
import type {CSSProperties} from "react";

type Props = {
    value?: string;
    status?: CharStatus;
    position?: number;
    isRevealing?: boolean;
    isCompleted?: boolean;
    isActive?: boolean;
    isCelebrating?: boolean;
    isLoading?: boolean | undefined;
    size?: "board" | "small";
};

const resultClasses: Partial<Record<CharStatus, string>> = {
    Absent: "tile-absent",
    Correct: "hit-correct",
    Present: "hit-present",
};

export default function GameGridCell({value, status, position = 0, isRevealing, isCompleted, isActive, isCelebrating, isLoading, size = "board"}: Props) {
    const resultClass = status ? resultClasses[status] : undefined;

    const sizeClasses = size === "small"
        ? "h-10 w-10 rounded-[9px] text-xl"
        : "size-[var(--tile)] rounded-xl text-[calc(var(--tile)*0.48)] sm:rounded-[14px]";

    if (isLoading) {
        return <Skeleton className={classnames("skeleton", sizeClasses)}/>;
    }

    // Tiles are only 3D while turning. Resting 3D layers show stray seams on some GPUs.
    if (resultClass && isRevealing && isCompleted) {
        const style = {
            "--flip-delay": `${position * REVEAL_TIME_MS}ms`,
            "--tile-h": size === "small" ? "40px" : "var(--tile)",
        } as CSSProperties;
        return (
            <div style={style} className={classnames("prevent-select tile-3d tile-swell font-bold", sizeClasses)}>
                <div className="tile-inner is-flipped is-flipping">
                    <div aria-hidden="true" className="tile-edge tile-edge-top"/>
                    <div aria-hidden="true" className="tile-edge tile-edge-bottom"/>
                    <div aria-hidden="true" className="tile-face tile-front tile-typed">
                        {value}
                        <span className="tile-shade"/>
                    </div>
                    <div className={classnames("tile-face tile-back", resultClass)}>
                        {value}
                        <span aria-hidden="true" className="tile-shade"/>
                    </div>
                </div>
            </div>
        );
    }

    const classes = classnames(
        'prevent-select box-border flex items-center justify-center border-[1.5px] font-bold',
        sizeClasses,
        resultClass,
        {
            'tile-empty': !resultClass && !value && !isActive,
            'tile-active': !resultClass && !value && isActive,
            'tile-typed': !resultClass && !!value,
            'cell-fill-animation': value && !isCompleted,
            'win-hop relative overflow-hidden': isCelebrating,
        }
    )

    return (
        <div className={classes} style={isCelebrating ? {animationDelay: `${position * 100}ms`} : undefined}>
            {value}
            {isCelebrating &&
                <span aria-hidden="true" className="win-sheen" style={{animationDelay: `${380 + position * 100}ms`}}/>}
        </div>
    )
}
