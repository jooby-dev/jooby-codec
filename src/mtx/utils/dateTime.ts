export interface IDateTime {
    isSummerTime: boolean,
    seconds: number,
    minutes: number,
    hours: number,
    day?: number,
    date: number,
    month: number,
    year: number
}

export interface ITimeCorrectionParameters {
    monthTransitionSummer: number,
    dateTransitionSummer: number,
    hoursTransitionSummer: number,
    hoursCorrectSummer: number,
    monthTransitionWinter: number,
    dateTransitionWinter: number,
    hoursTransitionWinter: number,
    hoursCorrectWinter: number,
    isCorrectionNeeded: boolean
}

// how to detect leap year: https://stackoverflow.com/a/11595914/5535820
export const isLeapYear = ( year: number ): boolean => (year & 3) === 0 && ((year % 25) !== 0 || (year & 15) === 0);

export const getMonthsDays = ( year: number ): Array<number> => [-1, 31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

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
    const lastSummerHour = dateToNumber(getLastWinterHour(correction, dateTime.year));
    const lastWinterHour = dateToNumber(getLastSummerHour(correction, dateTime.year));
    const dateTimeNumber = dateToNumber(dateTime);

    return lastSummerHour <= dateTimeNumber && dateTimeNumber <= lastWinterHour;
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
