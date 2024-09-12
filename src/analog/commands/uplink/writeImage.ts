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
 * // response to writeImage downlink command
 * const bytes = [0x00, 0x00, 0x00, 0x40, 0x01];
 *
 * // decoded payload
 * const parameters = writeImage.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {offset: 64, status: 1}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/WriteImage.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


export interface IWriteImageResponseParameters {
    /**
     * The offset at which to write the image content to the device's flash memory.
     */
    offset: types.TUint32,

    /**
     * `1` - the writing was successful <br>
     * `0` - the writing failed
     */
    status: types.TUint8
}


export const id: types.TCommandId = 0x2a1f;
export const name: types.TCommandName = 'writeImage';
export const headerSize = 3;

const COMMAND_BODY_SIZE = 5;

export const examples: command.TCommandExamples = {
    'write image': {
        id,
        name,
        headerSize,
        parameters: {offset: 64, status: 1},
        bytes: [
            0x1f, 0x2a, 0x05,
            0x00, 0x00, 0x00, 0x40, 0x01
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - command body bytes
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IWriteImageResponseParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return {
        offset: buffer.getUint32(),
        status: buffer.getUint8()
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IWriteImageResponseParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);

    buffer.setUint32(parameters.offset);
    buffer.setUint8(parameters.status);

    return command.toBytes(id, buffer.data);
};
