/**
 * Uplink command to get device identifier.
 *
 *  downlink command: `GetDeviceId`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDeviceId from 'jooby-codec/mtx/commands/uplink/getDeviceId.js';
 *
 * const bytes = [0x00, 0x1a, 0x79, 0x17, 0x14, 0x1b, 0x1d, 0x6a];
 *
 * // decoded payload
 * const parameters = getDeviceId.fromBytes(bytes);
 *
 * console.log(command.parameters);
 * // output:
 * {
 *     manufacturer: '001a79',
 *     type: 23,
 *     year: 20,
 *     serial: '1b1d6a'
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/uplink/GetDeviceId.md#response)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import * as accessLevels from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IDeviceId} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x05;
export const name: types.TCommandName = 'getDeviceId';
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = accessLevels.READ_ONLY;
export const maxSize = 8;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        accessLevel,
        maxSize,
        parameters: {
            manufacturer: '001a79',
            type: 23,
            year: 20,
            serial: '1b1d6a'
        },
        bytes: [
            0x05, 0x08,
            0x00, 0x1a, 0x79, 0x17, 0x14, 0x1b, 0x1d, 0x6a
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IDeviceId => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getDeviceId();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IDeviceId ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    // body
    buffer.setDeviceId(parameters);

    return command.toBytes(id, buffer.data);
};
