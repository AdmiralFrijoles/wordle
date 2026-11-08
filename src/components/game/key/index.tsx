import classnames from 'classnames'
import {CharStatus} from "@/types";
import React, {ReactNode} from "react";
import {Skeleton} from "@heroui/react";

type Props = {
    children?: ReactNode;
    value: string;
    label?: string;
    onClick?: (letter: string) => void;
    status?: CharStatus;
    isRevealing?: boolean;
    disabled?: boolean | undefined;
};

export default function Key({ children, value, label, status, onClick, disabled }: Props) {
    const isWide = value === "ENTER" || value === "DELETE";
    const classes = classnames(
        'prevent-select flex h-14 min-w-0 cursor-pointer items-center justify-center rounded-[10px] p-0 font-semibold sm:h-[58px] sm:rounded-[11px]',
        isWide ? 'flex-[1.55_1_0] text-xs tracking-[0.04em]' : 'flex-[1_1_0] text-[17px]',
        {
            'key-default': !status || status === "Guessing",
            'key-absent': status === 'Absent',
            'hit-correct [--hit-glow:calc(var(--tile-glow)*0.6)]': status === 'Correct',
            'hit-present [--hit-glow:calc(var(--tile-glow)*0.6)]': status === 'Present',
        }
    )

    function handleOnLetterClick(event: React.MouseEvent<HTMLButtonElement>) {
        if (disabled) {
            return;
        }
        if (onClick) {
            onClick(value);
        }
        event.currentTarget.blur();
    }

    const spokenStatus = status && status !== "Guessing" ? ` ${status.toLowerCase()}` : '';

    return (
        <>
        {disabled ? <Skeleton className={classnames("skeleton h-14 sm:h-[58px]", isWide ? 'flex-[1.55_1_0]' : 'flex-[1_1_0]')}/> :
        <button type="button"
                aria-label={`${label ?? value}${spokenStatus}`}
                className={classes}
                onClick={handleOnLetterClick}
        >
            {children || value}
        </button>}
        </>
    );
}
