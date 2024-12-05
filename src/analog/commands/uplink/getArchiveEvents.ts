/**
 * Command to receive events from device archive.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getArchiveEvents from 'jooby-codec/analog/commands/uplink/getArchiveEvents.js';
 *
 * // 1 event "MAGNET_ON" at 2023.04.05 13:17:20 GMT
 * const bytes = [0x2b, 0xc0, 0x31, 0x60, 0x01, 0x01];
 *
 * // decoded payload
 * const parameters = getArchiveEvents.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     eventList: [
 *         {
 *             time2000: 734015840,
 *             id: 1,
 *             sequenceNumber: 1
 *         }
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveEvents.md#response)
 */

import * as types from '../../../types.js';
import {TTime2000} from '../../utils/time.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as events from '../../constants/events.js';
import eventNames from '../../constants/eventNames.js';


interface IArchiveEvent {
    time2000: TTime2000;

    /** One of the {@link events | device events}. */
    id: types.TUint8;
    name?: string,

    /** It's a unique number for each event. */
    sequenceNumber: types.TUint8;
}

interface IGetArchiveEventsResponseParameters {
    eventList: Array<IArchiveEvent>;
}


export const id: types.TCommandId = 0x0b;
export const name: types.TCommandName = 'getArchiveEvents';
export const headerSize = 2;

const COMMAND_BODY_MIN_SIZE = 4 + 1 + 1;

export const examples: command.TCommandExamples = {
    '1 event "MAGNET_ON" at 2023.04.05 13:17:20 GMT': {
        id,
        name,
        headerSize,
        parameters: {
            eventList: [
                {
                    time2000: 734015840,
                    id: 1,
                    name: 'MAGNET_ON',
                    sequenceNumber: 1
                }
            ]
        },
        bytes: [
            0x0b, 0x06,
            0x2b, 0xc0, 0x31, 0x60, 0x01, 0x01
        ]
    },
    '4 events': {
        id,
        name,
        headerSize,
        parameters: {
            eventList: [
                {
                    time2000: 734015840,
                    id: 2,
                    name: 'MAGNET_OFF',
                    sequenceNumber: 1
                },
                {
                    time2000: 734025840,
                    id: 1,
                    name: 'MAGNET_ON',
                    sequenceNumber: 2
                },
                {
                    time2000: 734035840,
                    id: 3,
                    name: 'ACTIVATE',
                    sequenceNumber: 3
                },
                {
                    time2000: 734045840,
                    id: 4,
                    name: 'DEACTIVATE',
                    sequenceNumber: 4
                }
            ]
        },
        bytes: [
            0x0b, 0x18,
            0x2b, 0xc0, 0x31, 0x60, 0x02, 0x01, 0x2b, 0xc0,
            0x58, 0x70, 0x01, 0x02, 0x2b, 0xc0, 0x7f, 0x80,
            0x03, 0x03, 0x2b, 0xc0, 0xa6, 0x90, 0x04, 0x04
        ]
    }
};


const getEvent = ( buffer: ICommandBinaryBuffer ): IArchiveEvent => {
    const time2000 = buffer.getTime();
    const eventId = buffer.getUint8();
    const sequenceNumber = buffer.getUint8();

    return {
        time2000,
        id: eventId,
        name: eventNames[eventId],
        sequenceNumber
    };
};

const setEvent = ( buffer: ICommandBinaryBuffer, event: IArchiveEvent ): void => {
    buffer.setTime(event.time2000);
    buffer.setUint8(event.id);
    buffer.setUint8(event.sequenceNumber);
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IGetArchiveEventsResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const eventList: Array<IArchiveEvent> = [];

    while ( buffer.bytesLeft > 0 ) {
        eventList.push(getEvent(buffer));
    }

    return {eventList};
};

/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export function toBytes ( parameters: IGetArchiveEventsResponseParameters ): types.TBytes {
    const {eventList} = parameters;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(eventList.length * COMMAND_BODY_MIN_SIZE);

    eventList.forEach(event => setEvent(buffer, event));

    return command.toBytes(id, buffer.data);
}
