/**
 * Uplink command to get [DST](https://en.wikipedia.org/wiki/Daylight_saving_time)/Standard time transition options.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getCorrectTime from 'jooby-codec/obis-observer/commands/uplink/getCorrectTime.js';
 *
 * // default parameters
 * const bytes = [0x03, 0x00, 0x03, 0x01, 0x0a, 0x00, 0x04, 0x01, 0x01];
 *
 * // decoded payload
 * const parameters = getCorrectTime.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     monthTransitionSummer: 3,
 *     dateTransitionSummer: 0,
 *     hoursTransitionSummer: 3,
 *     hoursCorrectSummer: 1,
 *     monthTransitionWinter: 10,
 *     dateTransitionWinter: 0,
 *     hoursTransitionWinter: 4,
 *     hoursCorrectWinter: 1,
 *     isCorrectionNeeded: true
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetCorrectTime.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';


interface ITimeCorrectionParameters {
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


export const id: types.TCommandId = 0x3e;
export const name: types.TCommandName = 'getCorrectTime';
export const headerSize = 2;

const COMMAND_BODY_SIZE = 9;

export const examples: command.TCommandExamples = {
    'default parameters': {
        id,
        name,
        headerSize,
        parameters: {
            monthTransitionSummer: 3,
            dateTransitionSummer: 0,
            hoursTransitionSummer: 3,
            hoursCorrectSummer: 1,
            monthTransitionWinter: 10,
            dateTransitionWinter: 0,
            hoursTransitionWinter: 4,
            hoursCorrectWinter: 1,
            isCorrectionNeeded: true
        },
        bytes: [
            0x3e, 0x09,
            0x03, 0x00, 0x03, 0x01, 0x0a, 0x00, 0x04, 0x01, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): ITimeCorrectionParameters => {};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ITimeCorrectionParameters ): types.TBytes => {};
