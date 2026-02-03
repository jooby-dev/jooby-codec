/**
 * Command to request events from device archive.
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
 * // output:
 * [11, 5, 43, 189, 152, 173, 4]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetArchiveEvents.md#request)
 */

import * as types from '../../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    getTime,
    setTime
} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {TTime2000} from '../../utils/time.js';
import {getArchiveEvents as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';


/**
 * getArchiveEvents command parameters
 */
interface IGetArchiveEventsParameters {
    /**
     * Start date for requested archive events.
     */
    startTime2000: TTime2000;

    /**
     * The number of events to get from archive.
     */
    events: types.TUint8;
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = 5;

export const examples: command.TCommandExamples = {
    'request 4 events from 2023.04.03 14:01:17 GMT': {
        id,
        name,
        headerSize,
        parameters: {startTime2000: 733845677, events: 4},
        bytes: [
            0x0b, 0x05,
            0x2b, 0xbd, 0x98, 0xad, 0x04
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetArchiveEventsParameters => {
    validateCommandPayload(name, bytes, COMMAND_BODY_SIZE);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const startTime2000 = getTime(buffer);
    const events = buffer.getUint8();

    if ( !buffer.isEmpty ) {
        throw new Error('BinaryBuffer is not empty.');
    }

    return {startTime2000, events};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetArchiveEventsParameters ): types.TBytes => {
    const {startTime2000, events} = parameters;
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_SIZE, false);

    setTime(buffer, startTime2000);
    buffer.setUint8(events);

    return command.toBytes(id, buffer.data);
};
