import classnames from 'classnames'
import {CharStatus} from "@/types";
import {useSettings} from "@/providers/SettingsProvider";
import {REVEAL_TIME_MS} from "@/constants";
import React, {ReactNode} from "react";

const WORD_LENGTH = 5;

type Props = {
    children?: ReactNode;
    value: string;
    onClick?: (letter: string) => void;
    status?: CharStatus;
    width?:  number;
    isRevealing?: boolean;
};

export default function Key({ children, value, status, onClick, width = 40, isRevealing }: Props) {
    const settings = useSettings();
    const keyDelayMs = REVEAL_TIME_MS * WORD_LENGTH;
    const classes = classnames(
        'prevent-select xxshort:h-8 xxshort:w-8 xxshort:text-xxs xshort:w-10 xshort:h-10 flex short:h-12 h-14 items-center justify-center rounded mx-0.5 text-xs font-bold cursor-pointer select-none dark:text-white',
        {
            'transition ease-in-out': isRevealing,
            'bg-slate-200 dark:bg-slate-600 hover:bg-slate-300 active:bg-slate-400': !status || status === "Guessing",
            'bg-slate-400 dark:bg-slate-800 text-white': status === 'Absent',
            'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white':
                status === 'Correct' && settings.isHighContrast,
            'bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white':
                status === 'Present' && settings.isHighContrast,
            'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white':
                status === 'Correct' && !settings.isHighContrast,
            'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white':
                status === 'Present' && !settings.isHighContrast,
        }
    )

    const styles = {
        transitionDelay: isRevealing ? `${keyDelayMs}ms` : 'unset',
        width: `${width}px`,
    }

    function handleOnLetterClick(event: React.MouseEvent<HTMLButtonElement>) {
        if (onClick) onClick(value);
        event.currentTarget.blur();
    }

    return (
        <button style={styles}
                aria-label={`${value}${status ? ' ' + status : ''}`}
                className={classes}
                onClick={handleOnLetterClick}
        >
            {children || value}
        </button>
    );
}