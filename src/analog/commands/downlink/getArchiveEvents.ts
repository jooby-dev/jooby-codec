/**
 * Command to receive events from device archive.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getArchiveEvents from 'jooby-codec/analog/commands/downlink/getArchiveEvents.js';
 *
 * // request 4 events from 2023.04.03 14:01:17 GMT
 * const parameters = {startTime2000: 733845677, events: 4};
 * const bytes = getArchiveEvents.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // [11, 5, 43, 189, 152, 173, 4]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveEvents.md#request)
 */

import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {TTime2000} from '../../utils/time.js';


/**
 * getArchiveEvents command parameters
 */
interface IGetArchiveEventsParameters extends command.ICommandParameters {
    startTime2000: TTime2000;
    events: types.TUint8;
}


export const id: types.TCommandId = 0x0b;
export const headerSize = 2;

const COMMAND_BODY_SIZE = 5;

export const examples: command.TCommandExamples = {
    'request 4 events from 2023.04.03 14:01:17 GMT': {
        id,
        headerSize,
        parameters: {startTime2000: 733845677, events: 4},
        bytes: [
            0x0b, 0x05,
            0x2b, 0xbd, 0x98, 0xad, 0x04
        ]
    }
};


// data - only body (without header)
export const fromBytes = ( data: types.TBytes ): IGetArchiveEventsParameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const startTime2000 = buffer.getTime();
    const events = buffer.getUint8();

    if ( !buffer.isEmpty ) {
        throw new Error('BinaryBuffer is not empty.');
    }

    return {startTime2000, events};
};

// returns full message - header with body
export const toBytes = ( parameters: IGetArchiveEventsParameters ): types.TBytes => {
    const {startTime2000, events} = parameters;
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

    buffer.setTime(startTime2000);
    buffer.setUint8(events);

    return command.toBytes(id, buffer.data);
};
