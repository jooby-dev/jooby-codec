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
 *             name: 'POWER_OVER_RELAY_OFF',
 *             power: [22, 25, 12, 143]
 *         },
 *         {
 *             hours: 1,
 *             minutes: 12,
 *             seconds: 33,
 *             event: 121,
 *             name: 'TIME_CORRECT',
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
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetEvents.md#response)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import * as accessLevels from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IEvent} from '../../utils/CommandBinaryBuffer.js';


interface IGetCriticalEventResponseParameters {
    date: types.IDate,
    eventsNumber: types.TUint8,
    events: Array<IEvent>
}

// date + event number byte
const BODY_WITHOUT_EVENTS_SIZE = 3 + 1;
const EVENT_SIZE = 4;

export const id: types.TCommandId = 0x33;
export const name: types.TCommandName = 'getEvents';
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = accessLevels.READ_ONLY;
export const maxSize = BODY_WITHOUT_EVENTS_SIZE + 255 * EVENT_SIZE;
export const isLoraOnly = false;

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
                    name: 'POWER_OVER_RELAY_OFF',
                    power: [22, 25, 12, 143]
                },
                {
                    hours: 1,
                    minutes: 12,
                    seconds: 33,
                    event: 121,
                    name: 'TIME_CORRECT',
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
            0x01, 0x0c, 0x21, 0x79, 0x00, 0x0a, 0x16, 0x03, 0x04, 0x0c, 0x07, 0x18
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
    if ( bytes.length > maxSize ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const date = buffer.getDate();
    const eventsNumber = buffer.getUint8();
    const events = [];

    while ( !buffer.isEmpty ) {
        events.push(buffer.getEvent());
    }

    return {date, eventsNumber, events};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetCriticalEventResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setDate(parameters.date);
    buffer.setUint8(parameters.eventsNumber);

    for ( const event of parameters.events ) {
        buffer.setEvent(event);
    }

    return command.toBytes(id, buffer.getBytesToOffset());
};
