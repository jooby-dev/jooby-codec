/**
 * Command to write the block of the new image to the device.
 * This command is part of update procedure.
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
 *
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
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {getStringFromBytes, IBytesConversionFormatOptions} from '../../../utils/bytesConversion.js';
import {writeImage as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export interface IWriteImageParameters {
    /**
     * The offset at which to write the image content to the device's flash memory.
     */
    offset: types.TUint32,

    /**
     * The image content size should be a multiple of `8`.
     * <br>
     * In case there is less data it should be padded with zeros.
     */
    data: types.TBytes
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

const COMMAND_BODY_MIN_SIZE: number = 4;

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
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IWriteImageParameters => {
    if ( bytes.length < COMMAND_BODY_MIN_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);
    const offset = buffer.getUint32();

    return {offset, data: bytes.slice(COMMAND_BODY_MIN_SIZE)};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IWriteImageParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(COMMAND_BODY_MIN_SIZE, false);

    buffer.setUint32(parameters.offset);
    buffer.setBytes(parameters.data);

    return command.toBytes(id, buffer.data);
};


/**
 * Convert command parameters to JSON.
 *
 * @param parameters - command payload
 * @returns JSON representation of command parameters
 */
export const toJson = ( parameters: IWriteImageParameters, options: IBytesConversionFormatOptions ): string => JSON.stringify({
    ...parameters,
    data: getStringFromBytes(parameters.data, options)
});
