/**
 * Uplink command to get critical events.
 *
 * The corresponding downlink command: `getCriticalEvent`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getCriticalEvent from 'jooby-codec/mtx1/commands/uplink/getCriticalEvent.js';
 *
 * // response to getCriticalEvent downlink command
 * const bytes = [0x01, 0x01, 0xe9, 0x03, 0x0c, 0x0a, 0x16, 0x21, 0x07];
 *
 * // decoded payload
 * const parameters = getCriticalEvent.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *      event: 1,
 *      index: 1,
 *      date: {
 *          year: 233,
 *          month: 3,
 *          date: 12,
 *          hours: 10,
 *          minutes: 22,
 *          seconds: 33
 *      },
 *      count: 7
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetCriticalEvent.md#response)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import * as accessLevels from '../../constants/accessLevels.js';


interface IGetCriticalEventResponseParameters {
    /**
     * Event identifier.
     *
     * ({@link criticalEvents | critical event identifiers})
     */
    event: types.TUint8,

    index: types.TUint8,

    date: {
        year: types.TYear2000,
        month: types.TMonth,
        date: types.TMonthDay,
        hours: types.TUint8,
        minutes: types.TUint8,
        seconds: types.TUint8
    },

    count: types.TUint8
}


export const id: types.TCommandId = 0x41;
export const name: types.TCommandName = 'getCriticalEvent';
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = accessLevels.READ_ONLY;
export const maxSize = 9;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        accessLevel,
        maxSize,
        parameters: {
            event: 1,
            index: 1,
            date: {
                year: 23,
                month: 3,
                date: 12,
                hours: 10,
                minutes: 22,
                seconds: 33
            },
            count: 7
        },
        bytes: [
            0x41, 0x09,
            0x01, 0x01, 0x17, 0x03, 0x0c, 0x0a, 0x16, 0x21, 0x07
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IGetCriticalEventResponseParameters => {
    if ( bytes.length !== maxSize ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const [
        event,
        index,
        year,
        month,
        date,
        hours,
        minutes,
        seconds,
        count
    ] = bytes;

    return {
        event,
        index,
        date: {
            year,
            month,
            date,
            hours,
            minutes,
            seconds
        },
        count
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetCriticalEventResponseParameters ): types.TBytes => {
    const {event, index, date, count} = parameters;

    return command.toBytes(id, [
        event,
        index,
        date.year,
        date.month,
        date.date,
        date.hours,
        date.minutes,
        date.seconds,
        count
    ]);
};
