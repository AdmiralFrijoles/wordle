import {CalendarDate, today, getLocalTimeZone} from "@internationalized/date";
import {DateOnly} from "@/types";

const utc = "Etc/UTC";

export function todayUTC(): CalendarDate {
    return today(utc);
}

export function tomorrowUTC(): CalendarDate {
    return todayUTC().add({days: 1});
}

export function toLocalDate(date: CalendarDate): CalendarDate {
    const localTimeZone = getLocalTimeZone();
    return toTimeZone(date, localTimeZone);
}

export function toTimeZone(date: CalendarDate, timeZone: string): CalendarDate {
    const tmpDate = date.toDate(timeZone);
    return new CalendarDate(
        tmpDate.getFullYear(),
        tmpDate.getMonth() + 1,
        tmpDate.getDate()
    );
}

export function asDateOnly(date: CalendarDate | Date): DateOnly {
    if (date instanceof Date)
        return {
            year: date.getUTCFullYear(),
            month: date.getUTCMonth(),
            day: date.getUTCDate()
        } as DateOnly;
    else
        return {
            year: date.year,
            month: date.month - 1,
            day: date.day
        } as DateOnly;
}