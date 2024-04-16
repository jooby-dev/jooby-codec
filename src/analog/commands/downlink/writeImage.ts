/**
 * Command to write the block of the new image to the device. This command is part of update procedure.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as writeImage from 'jooby-codec/analog/commands/downlink/writeImage.js';
 *
 * const parameters = {
 *     offset: 64,
 *     data: [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]
 * };
 * const bytes = writeImage.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [31, 42, 20, 0, 0, 0, 64, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/WriteImage.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


export interface IWriteImageParameters {
    offset: types.TUint32,
    data: types.TBytes
}


export const id: types.TCommandId = 0x2a1f;
export const name: types.TCommandName = 'writeImage';
export const headerSize = 3;

const COMMAND_MIN_SIZE: number = 4;

export const examples: command.TCommandExamples = {
    'write image': {
        id,
        name,
        headerSize,
        parameters: {
            offset: 64,
            data: [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]
        },
        bytes: [
            0x1f, 0x2a, 0x14,
            0x00, 0x00, 0x00, 0x40, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - command body bytes
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IWriteImageParameters => {
    if ( data.length < COMMAND_MIN_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);
    const offset = buffer.getUint32(false);

    return {offset, data: data.slice(COMMAND_MIN_SIZE)};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IWriteImageParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_MIN_SIZE);

    buffer.setUint32(parameters.offset, false);
    buffer.setBytes(parameters.data);

    return command.toBytes(id, buffer.data);
};


/**
 * Convert command parameters to JSON.
 *
 * @param parameters - command payload
 * @returns JSON representation of command parameters
 */
export const toJson = ( parameters: IWriteImageParameters ): string => JSON.stringify(parameters);
