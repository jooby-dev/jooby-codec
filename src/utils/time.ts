const INITIAL_YEAR_TIMESTAMP = 946684800000;
const MILLISECONDS_IN_SECONDS = 1000;


/**
 * Get date object from UTC seconds since 2000 year.
 *
 * @param seconds - seconds since 2000 year
 * @returns Date object instance
 */
export const getDateFromSeconds = ( seconds: number ): Date => new Date(INITIAL_YEAR_TIMESTAMP + (seconds * MILLISECONDS_IN_SECONDS));

/**
 * Get UTC seconds since 2000 year from Date object.
 *
 * @param date - Date object
 * @returns seconds since 2000 year
 */
export const getSecondsFromDate = ( date: Date ): number => (date.getTime() - INITIAL_YEAR_TIMESTAMP) / MILLISECONDS_IN_SECONDS;
