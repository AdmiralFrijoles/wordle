import classNames from "classnames";

type Props = {
    index: number;
    size: number;
    label: string;
    isCurrentDayStatRow: boolean;
}

export default function Progress({index, size, label, isCurrentDayStatRow}: Props) {
    const barClass = classNames(
        'flex h-[26px] min-w-[34px] items-center justify-end rounded-lg px-[9px] text-[13px] font-bold',
        isCurrentDayStatRow
            ? 'bg-linear-to-r from-[#5457ee] to-[#7c83ff] text-white shadow-[0_4px_10px_-6px_rgb(99_102_241/0.45)]'
            : 'bg-bar text-bar-fg'
    )
    return (
        <div className="flex items-center gap-2.5">
            <span className={classNames(
                "w-3 text-center text-[13px]",
                isCurrentDayStatRow ? "font-bold text-fg" : "font-semibold text-fg-sub"
            )}>
                {index + 1}
            </span>
            <div className="h-[26px] flex-1 rounded-lg bg-bar-track">
                <div style={{ width: `${8 + size}%` }} className={barClass}>
                    {label}
                </div>
            </div>
        </div>
    )
}
