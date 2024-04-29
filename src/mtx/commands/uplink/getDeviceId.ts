/**
 * Uplink command to get device identifier.
 *
 * The corresponding downlink command: `GetDeviceId`.
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


const COMMAND_BODY_SIZE = 8;

export const id: types.TCommandId = 0x05;
export const name: types.TCommandName = 'getDeviceId';
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = accessLevels.READ_ONLY;
export const maxSize = COMMAND_BODY_SIZE;


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
 * @param data - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( data: types.TBytes ): IDeviceId => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return buffer.getDeviceId();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IDeviceId ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(headerSize + COMMAND_BODY_SIZE);

    // header + size
    buffer.setUint8(id as number);
    buffer.setUint8(COMMAND_BODY_SIZE);

    // body
    buffer.setDeviceId(parameters);

    return buffer.data;
};
