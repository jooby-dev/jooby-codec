import {BrandType} from '../../types.js';


/**
 * Seconds since year 2000.
 *
 * @example
 * Time `2023-04-03T14:01:17.000Z` is `1680530477` in Unix time representation.
 * Unix time for year `2000` is `946684800` so seconds since year `2000` is `1680530477` - `946684800` = `733845677`.
 */
export type TTime2000 = BrandType<number, 'seconds'>;


const INITIAL_YEAR_TIMESTAMP = 946684800000;
const MILLISECONDS_IN_SECONDS = 1000;


/**
 * Get date object from UTC seconds since 2000 year.
 *
 * @param time2000 - seconds since 2000 year
 * @returns Date object instance
 */
export const getDateFromTime2000 = ( time2000: TTime2000 ): Date => new Date(INITIAL_YEAR_TIMESTAMP + (time2000 * MILLISECONDS_IN_SECONDS));

/**
 * Get UTC seconds since 2000 year from Date object.
 *
 * @param date - Date object
 * @returns seconds since 2000 year
 */
export const getTime2000FromDate = ( date: Date ): TTime2000 => (date.getTime() - INITIAL_YEAR_TIMESTAMP) / MILLISECONDS_IN_SECONDS;
