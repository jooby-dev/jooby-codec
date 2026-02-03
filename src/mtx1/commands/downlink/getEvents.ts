/**
 * Downlink command to get device events by date.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getEvents from 'jooby-codec/mtx1/commands/downlink/getEvents.js';
 *
 * const parameters = {
 *     date: {
 *         year: 24,
 *         month: 2,
 *         date: 12
 *     },
 *     offset: 23
 * };
 *
 * const bytes = getEvents.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [51, 4, 24, 2, 12, 23]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetEvents.md#request)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {
    getDate,
    setDate
} from '../../utils/CommandBinaryBuffer.js';
import {getEvents as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';


interface IGetEventsParameters {
    date: types.IDate,
    offset: types.TUint8
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 4;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        accessLevel,
        maxSize,
        parameters: {
            date: {
                year: 24,
                month: 2,
                date: 12
            },
            offset: 23
        },
        bytes: [
            0x33, 0x04,
            0x18, 0x02, 0x0c, 0x17
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetEventsParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const date = getDate(buffer);
    const offset = buffer.getUint8();

    return {date, offset};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetEventsParameters ) : types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    setDate(buffer, parameters.date);
    buffer.setUint8(parameters.offset);

    return command.toBytes(id, buffer.data);
};
