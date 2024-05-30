/**
 * Downlink command to get device events by date.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getEvents from 'jooby-codec/mtx/commands/downlink/getEvents.js';
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
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetEvents.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import * as accessLevels from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


interface IGetEventsParameters {
    date: types.IDate,
    offset: types.TUint8
}


export const id: types.TCommandId = 0x33;
export const name: types.TCommandName = 'getEvents';
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = accessLevels.READ_ONLY;
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
    if ( bytes.length !== maxSize ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const date = buffer.getDate();
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
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setDate(parameters.date);
    buffer.setUint8(parameters.offset);

    return command.toBytes(id, buffer.data);
};
