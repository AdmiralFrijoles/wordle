import {CharStatus} from "@/types";
import {useSettings} from "@/providers/SettingsProvider";
import classnames from "classnames";
import {REVEAL_TIME_MS} from "@/constants";
import {Skeleton} from "@nextui-org/react";

type Props = {
    value?: string;
    status?: CharStatus;
    position?: number;
    isRevealing?: boolean;
    isCompleted?: boolean;
    isLoading?: boolean | undefined;
};

export default function GameGridCell({value, status, position = 0, isRevealing, isCompleted, isLoading}: Props) {
    const settings = useSettings();

    const isFilled = value && !isCompleted
    const shouldReveal = isRevealing && isCompleted
    const animationDelay = `${isCompleted ? position * REVEAL_TIME_MS : 0}ms`

    const classes = classnames(
        'prevent-select xxshort:w-11 xxshort:h-11 short:text-2xl short:w-12 short:h-12 w-14 h-14 border-solid border-2 flex items-center justify-center mx-0.5 text-4xl font-bold rounded dark:text-white',
        {
            'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600':
                !status || status === "Guessing",
            'border-black dark:border-slate-100':
                value && (!status || status === "Guessing"),
            'absent shadowed bg-slate-400 dark:bg-slate-700 text-white border-slate-400 dark:border-slate-700':
                status === 'Absent',
            'correct shadowed bg-orange-500 text-white border-orange-500':
                status === 'Correct' && settings.isHighContrast,
            'present shadowed bg-cyan-500 text-white border-cyan-500':
                status === 'Present' && settings.isHighContrast,
            'correct shadowed bg-green-500 text-white border-green-500':
                status === 'Correct' && !settings.isHighContrast,
            'present shadowed bg-yellow-500 text-white border-yellow-500':
                status === 'Present' && !settings.isHighContrast,
            'cell-fill-animation': isFilled,
            'cell-reveal': shouldReveal,
        }
    )

    return (
        <>
            {isLoading ?
                <Skeleton className="skeleton xxshort:w-11 xxshort:h-11 short:w-12 short:h-12 w-14 h-14 flex items-center justify-center mx-0.5 rounded"/> :
                <div className={classes} style={{animationDelay}}>
                    <div className="letter-container" style={{animationDelay}}>
                        {value}
                    </div>
                </div>
            }
        </>
    )
}