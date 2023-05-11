/**
 * Helper to create special branded types from primitives.
 *
 * https://medium.com/@KevinBGreene/surviving-the-typescript-ecosystem-branding-and-type-tagging-6cf6e516523d
 */
type BrandType<K, T> = K & {info?: T};

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
 * @param time - seconds since 2000 year
 * @returns Date object instance
 */
export const getDateFromSeconds = ( time: TTime2000 ): Date => new Date(INITIAL_YEAR_TIMESTAMP + (time * MILLISECONDS_IN_SECONDS));

/**
 * Get UTC seconds since 2000 year from Date object.
 *
 * @param date - Date object
 * @returns seconds since 2000 year
 */
export const getSecondsFromDate = ( date: Date ): TTime2000 => (date.getTime() - INITIAL_YEAR_TIMESTAMP) / MILLISECONDS_IN_SECONDS;


// export default {
//     getDateFromSeconds,
//     getSecondsFromDate
// };
