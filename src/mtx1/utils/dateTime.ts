import * as types from '../types.js';


export interface IDateTime {
    /**
     * Is it DST or Standard time.
     */
    isSummerTime: boolean,

    seconds: types.TUint8,
    minutes: types.TUint8,
    hours: types.TUint8,
    day?: types.TWeekDay,
    date: types.TMonthDay,
    month: types.TMonth,
    year: types.TYear2000
}


export interface ITimeCorrectionParameters {
    /**
     * The month of transition to daylight saving time.
     */
    monthTransitionSummer: types.TMonth,

    /**
     * The date of transition to daylight saving time.
     * If it is `0`, then it refers to the last Sunday of the month.
     */
    dateTransitionSummer: types.TMonthDay,

    /**
     * The hour of transition to daylight saving time.
     */
    hoursTransitionSummer: types.TUint8,

    /**
     * The adjustment in hours during the transition to daylight saving time.
     */
    hoursCorrectSummer: types.TUint8,

    /**
     * The month of transition to standard time.
     */
    monthTransitionWinter: types.TMonth,

    /**
     * The date of transition to standard time.
     * If it is `0`, then it refers to the last Sunday of the month.
     */
    dateTransitionWinter: types.TMonthDay,

    /**
     * The hour of transition to standard time.
     */
    hoursTransitionWinter: types.TUint8,

    /**
     * The adjustment in hours during the transition to standard time.
     */
    hoursCorrectWinter: types.TUint8,

    /**
     * Does the transition to DST/Standard time occur?
     */
    isCorrectionNeeded: boolean
}

// how to detect leap year: https://stackoverflow.com/a/11595914/5535820
export const isLeapYear = ( year: types.TYear2000 ): boolean => (year & 3) === 0 && ((year % 25) !== 0 || (year & 15) === 0);

export const getMonthsDays = ( year: types.TYear2000 ): Array<number> => [-1, 31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const isDateTimeValid = ( dateTime: IDateTime ): boolean => (
    dateTime.year < 0xff
    && ( dateTime.month > 0 && dateTime.month <= 12 )
    && ( dateTime.date > 0 && dateTime.date <= getMonthsDays(dateTime.year)[dateTime.month] )
    && ( dateTime.hours >= 0 && dateTime.hours <= 23 )
    && ( dateTime.minutes >= 0 && dateTime.minutes <= 59 )
    && ( dateTime.seconds >= 0 && dateTime.seconds <= 59 )
);

// https://stackoverflow.com/a/63455760
// year starts from 0 (2000), month starts from 1
// 2024.01 -> 28
const getLastMonthSunday = ( year: number, month: number ): number => {
    const date = new Date(2000 + year, month, 1, 12);
    const weekday = date.getDay();
    const dayDiff = weekday === 0 ? 7 : weekday;

    date.setDate(date.getDate() - dayDiff);

    return date.getDate();
};

export const getLastSummerHour = ( correction: ITimeCorrectionParameters, year: number ): IDateTime => ({
    year,
    month: correction.monthTransitionWinter,
    date: correction.dateTransitionWinter === 0
        ? getLastMonthSunday(year, correction.monthTransitionWinter)
        : correction.dateTransitionWinter,
    hours: correction.hoursTransitionWinter - 1,
    minutes: 0,
    seconds: 0,
    isSummerTime: true
});

export const getLastWinterHour = ( correction: ITimeCorrectionParameters, year: number ): IDateTime => ({
    year,
    month: correction.monthTransitionSummer,
    date: correction.dateTransitionSummer === 0
        ? getLastMonthSunday(year, correction.monthTransitionSummer)
        : correction.dateTransitionSummer,
    hours: correction.hoursTransitionSummer - 1,
    minutes: 0,
    seconds: 0,
    isSummerTime: false
});

const dateToNumber = ( dateTime: IDateTime ) => (dateTime.month << 24) | (dateTime.date << 16) | (dateTime.hours << 8) | dateTime.minutes;

export const getSummerTimeFlag = ( correction: ITimeCorrectionParameters, dateTime: IDateTime ) => {
    const lastWinterHour = dateToNumber(getLastWinterHour(correction, dateTime.year));
    const lastSummerHour = dateToNumber(getLastSummerHour(correction, dateTime.year));
    const dateTimeNumber = dateToNumber(dateTime);

    return lastWinterHour <= dateTimeNumber && dateTimeNumber <= lastSummerHour;
};

export const getDateTimeFromDate = ( correction: ITimeCorrectionParameters, date: Date ) => {
    const dateTime: IDateTime = {
        isSummerTime: false,
        seconds: date.getSeconds(),
        minutes: date.getMinutes(),
        hours: date.getHours(),
        day: date.getDay(),
        date: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear() - 2000
    };

    dateTime.isSummerTime = getSummerTimeFlag(correction, dateTime);

    return dateTime;
};

export const getDateFromDateTime = ( dateTime: IDateTime ) => new Date(
    dateTime.year + 2000,
    dateTime.month - 1,
    dateTime.date,
    dateTime.hours,
    dateTime.minutes,
    dateTime.seconds
);
