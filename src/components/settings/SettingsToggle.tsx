"use client";

import classnames from 'classnames'
import {useId} from "react";

type Props = {
    settingName: string
    flag: boolean
    handleFlag: (isEnabled: boolean) => void;
    description?: string
}

export default function SettingsToggle({settingName, flag, handleFlag, description}: Props) {
    const labelId = useId();
    const descriptionId = useId();

    const track = classnames(
        'flex h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors duration-300',
        flag
            ? 'justify-end bg-linear-to-b from-[#2fc76d] to-[#1fa855] shadow-[0_4px_10px_-6px_rgb(34_179_94/0.4)]'
            : 'justify-start bg-switch-off'
    )
    const knob = classnames(
        'h-[26px] w-[26px] rounded-full shadow-[0_2px_6px_rgb(0_0_0/0.3)]',
        flag ? 'bg-white' : 'bg-switch-knob-off'
    )

    return (
        <div className="flex items-center gap-4 px-4 py-3.5">
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span id={labelId} className="text-base font-semibold text-fg">{settingName}</span>
                {description && (
                    <span id={descriptionId} className="text-[13px] leading-snug text-fg-sub">{description}</span>
                )}
            </div>
            <button type="button" role="switch" aria-checked={flag} aria-labelledby={labelId}
                    aria-describedby={description ? descriptionId : undefined}
                    className={track} onClick={() => handleFlag(!flag)}>
                <span className={knob}/>
            </button>
        </div>
    )
}
