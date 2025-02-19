﻿"use client";

import classnames from 'classnames'

type Props = {
    settingName: string
    flag: boolean
    handleFlag: (isEnabled: boolean) => void;
    description?: string
}

export default function SettingsToggle({settingName, flag, handleFlag, description}: Props) {
    const toggleHolder = classnames(
        'w-14 h-8 flex shrink-0 items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 duration-300 ease-in-out cursor-pointer',
        {
            'bg-green-400 dark:bg-green-600': flag,
        }
    )
    const toggleButton = classnames(
        'bg-white dark:bg-gray-300 w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out cursor-pointer',
        {
            'translate-x-6': flag,
        }
    )

    return (
        <>
            <div className="flex justify-between gap-4 py-3">
                <div className="mt-0 text-left text-gray-500 dark:text-gray-300">
                    <p className="leading-none">{settingName}</p>
                    {description && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
                            {description}
                        </p>
                    )}
                </div>
                <div className={toggleHolder} onClick={() => handleFlag(!flag)}>
                    <div className={toggleButton} />
                </div>
            </div>
        </>
    )
}