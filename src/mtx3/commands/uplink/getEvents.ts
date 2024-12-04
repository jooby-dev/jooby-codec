/**
 * Uplink command to get device events by date.
 *
 * The corresponding downlink command: `getEvents`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getEvents from 'jooby-codec/mtx1/commands/uplink/getEvents.js';
 *
 * // response to getEvents downlink command
 * const bytes = [
 *     0x17, 0x03, 0x0c, 0x02, 0x01, 0x0c, 0x21, 0x9d, 0x16, 0x19, 0x0c, 0x8f
 *     0x01, 0x0c, 0x21, 0x79, 0x00, 0x0a, 0x16, 0x03, 0x04, 0x0c, 0x07, 0x18
 * ];
 *
 * // decoded payload
 * const parameters = getEvents.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     date: {
 *         year: 23,
 *         month: 3,
 *         date: 12
 *     },
 *     eventsNumber: 2,
 *     events: [
 *         {
 *             hours: 1,
 *             minutes: 12,
 *             seconds: 33,
 *             event: 157,
 *             eventName: 'POWER_OVER_RELAY_OFF',
 *             power: [22, 25, 12, 143]
 *         },
 *         {
 *             hours: 1,
 *             minutes: 12,
 *             seconds: 33,
 *             event: 142,
 *             eventName: 'TIME_CORRECT',
 *             newDate: {
 *                 isSummerTime: 0,
 *                 seconds: 10,
 *                 minutes: 22,
 *                 hours: 3,
 *                 day: 4,
 *                 date: 12,
 *                 month: 7,
 *                 year: 24
 *             }
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetEvents.md#response)
 */

import * as command from '../../../mtx1/utils/command.js';
import * as mtx1 from '../../../mtx1/commands/uplink/getEvents.js';
import CommandBinaryBuffer from '../../utils/CommandBinaryBuffer.js';


export const {
    id,
    name,
    headerSize,
    accessLevel,
    maxSize,
    isLoraOnly
} = mtx1;


export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        accessLevel,
        maxSize,
        parameters: {
            date: {
                year: 23,
                month: 3,
                date: 12
            },
            eventsNumber: 2,
            events: [
                {
                    hours: 1,
                    minutes: 12,
                    seconds: 33,
                    event: 157,
                    eventName: 'POWER_OVER_RELAY_OFF',
                    power: [22, 25, 12, 143]
                },
                {
                    hours: 1,
                    minutes: 12,
                    seconds: 33,
                    event: 142,
                    eventName: 'TIME_CORRECT',
                    newDate: {
                        isSummerTime: false,
                        seconds: 10,
                        minutes: 22,
                        hours: 3,
                        day: 4,
                        date: 12,
                        month: 7,
                        year: 24
                    }
                }
            ]
        },
        bytes: [
            0x33, 0x18,
            0x17, 0x03, 0x0c, 0x02, 0x01, 0x0c, 0x21, 0x9d, 0x16, 0x19, 0x0c, 0x8f,
            0x01, 0x0c, 0x21, 0x8e, 0x00, 0x0a, 0x16, 0x03, 0x04, 0x0c, 0x07, 0x18
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = mtx1.getFromBytes(CommandBinaryBuffer);


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = mtx1.getToBytes(CommandBinaryBuffer);
