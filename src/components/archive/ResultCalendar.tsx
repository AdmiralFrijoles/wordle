"use client";

import classnames from "classnames";
import {useState} from "react";
import {
    CalendarDate,
    DateFormatter,
    endOfMonth,
    endOfWeek,
    getLocalTimeZone,
    isSameDay,
    startOfMonth,
    startOfWeek,
} from "@internationalized/date";
import {GameStates} from "@/types";
import {ChevronLeftIcon, ChevronRightIcon} from "@/components/icons";

export type DayResult = keyof typeof GameStates;

type Props = {
    value: CalendarDate;
    minValue: CalendarDate;
    maxValue: CalendarDate;
    availableDates: Set<string>;
    results: Map<string, DayResult>;
    onSelect: (date: CalendarDate) => void;
};

export function dateKey(date: { year: number, month: number, day: number }): string {
    return `${date.year}-${date.month}-${date.day}`;
}

const dayBase = "relative flex h-11 items-center justify-center rounded-xl p-0 text-[15px] font-semibold tabular-nums";

export default function ResultCalendar({value, minValue, maxValue, availableDates, results, onSelect}: Props) {
    const locale = (new Intl.NumberFormat()).resolvedOptions().locale;
    const timeZone = getLocalTimeZone();
    const [visibleMonth, setVisibleMonth] = useState(startOfMonth(value));

    const monthFormatter = new DateFormatter(locale, {month: "long", year: "numeric"});
    const dayFormatter = new DateFormatter(locale, {dateStyle: "full"});
    const narrowWeekday = new DateFormatter(locale, {weekday: "narrow"});
    const longWeekday = new DateFormatter(locale, {weekday: "long"});

    const firstShown = startOfWeek(visibleMonth, locale);
    const lastShown = endOfWeek(endOfMonth(visibleMonth), locale);
    const canGoBack = visibleMonth.compare(startOfMonth(minValue)) > 0;
    const canGoForward = visibleMonth.compare(startOfMonth(maxValue)) < 0;

    const weekdays = Array.from({length: 7}, (_, i) => firstShown.add({days: i}).toDate(timeZone));
    const days: CalendarDate[] = [];
    for (let day = firstShown; day.compare(lastShown) <= 0; day = day.add({days: 1})) {
        days.push(day);
    }

    function renderDay(day: CalendarDate) {
        if (day.month !== visibleMonth.month) {
            return <span key={dateKey(day)} aria-hidden="true"/>;
        }

        const key = dateKey(day);
        const isPlayable = availableDates.has(key) && day.compare(minValue) >= 0 && day.compare(maxValue) <= 0;
        const isSelected = isSameDay(day, value);
        const result = isPlayable ? results.get(key) : undefined;

        let state = "not played";
        if (!isPlayable) {
            state = "unavailable";
        } else if (result === "Win") {
            state = "won";
        } else if (result === "Loss") {
            state = "lost";
        }

        const classes = classnames(dayBase, {
            "btn-primary cursor-pointer": isSelected && isPlayable,
            "hit-correct [--hit-glow:0] cursor-pointer font-bold": !isSelected && result === "Win",
            "bg-tile-absent text-tile-absent-fg cursor-pointer": !isSelected && result === "Loss",
            "cursor-pointer text-fg shadow-[inset_0_0_0_1px_var(--cal-open-ring)] hover:bg-hover":
                !isSelected && isPlayable && result !== "Win" && result !== "Loss",
            "text-cal-future": !isPlayable,
        });

        return (
            <button key={key} type="button" disabled={!isPlayable} className={classes}
                    aria-label={`${dayFormatter.format(day.toDate(timeZone))}, ${state}`}
                    aria-current={isSelected ? "date" : undefined}
                    onClick={() => onSelect(day)}>
                {day.day}
                {!isSelected && result === "Loss" &&
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2"
                         strokeLinecap="round" aria-hidden="true"
                         className="absolute top-1.5 right-1.5 text-cal-lost-mark">
                        <path d="M2 2l6 6"/>
                        <path d="M8 2l-6 6"/>
                    </svg>}
            </button>
        );
    }

    return (
        <div className="glass flex flex-col gap-2 rounded-[20px] px-2.5 pt-3 pb-3.5">
            <div className="flex items-center justify-between">
                <button type="button" aria-label="Previous month" disabled={!canGoBack}
                        onClick={() => setVisibleMonth(visibleMonth.subtract({months: 1}))}
                        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-fg-icon transition-colors hover:bg-hover disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent">
                    <ChevronLeftIcon size={20}/>
                </button>
                <span aria-live="polite" className="text-base font-bold text-fg">
                    {monthFormatter.format(visibleMonth.toDate(timeZone))}
                </span>
                <button type="button" aria-label="Next month" disabled={!canGoForward}
                        onClick={() => setVisibleMonth(visibleMonth.add({months: 1}))}
                        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-fg-icon transition-colors hover:bg-hover disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent">
                    <ChevronRightIcon size={20}/>
                </button>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {weekdays.map((weekday, i) => (
                    <abbr key={i} title={longWeekday.format(weekday)}
                          className="flex h-7 items-center justify-center text-xs font-semibold text-fg-muted no-underline">
                        {narrowWeekday.format(weekday)}
                    </abbr>
                ))}
                {days.map(renderDay)}
            </div>
            <div className="mt-1.5 flex justify-center gap-5 border-t border-line pt-3 text-xs font-medium text-fg-sub">
                <span className="inline-flex items-center gap-[7px]">
                    <span aria-hidden="true" className="hit-correct h-3 w-3 rounded border-0 [--hit-glow:0]"/>Won
                </span>
                <span className="inline-flex items-center gap-[7px]">
                    <span aria-hidden="true" className="h-3 w-3 rounded bg-tile-absent"/>Lost
                </span>
                <span className="inline-flex items-center gap-[7px]">
                    <span aria-hidden="true" className="h-3 w-3 rounded shadow-[inset_0_0_0_1px_var(--cal-open-ring)]"/>Not played
                </span>
            </div>
        </div>
    );
}
