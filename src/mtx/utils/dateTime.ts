// how to detect leap year: https://stackoverflow.com/a/11595914/5535820
export const isLeapYear = ( year: number ): boolean => (year & 3) === 0 && ((year % 25) !== 0 || (year & 15) === 0);

export const getMonthsDays = ( year: number ): Array<number> => [-1, 31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// https://stackoverflow.com/questions/11887934/how-to-check-if-dst-daylight-saving-time-is-in-effect-and-if-so-the-offset#answer-11888430
const stdTimezoneOffset = ( date: Date ): number => {
    const jan = new Date(date.getFullYear(), 0, 1);
    const jul = new Date(date.getFullYear(), 6, 1);

    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
};

export const isDstObserved = ( date: Date ): boolean => date.getTimezoneOffset() < stdTimezoneOffset(date);
