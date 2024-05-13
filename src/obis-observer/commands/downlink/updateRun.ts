/**
 * Downlink command to write the block of the new image to the device. This command is part of update procedure.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as updateRun from 'jooby-codec/obis-observer/commands/downlink/updateRun.js';
 *
 * const parameters = {
 *     requestId: 33
 * };
 * const bytes = updateRun.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [52, 1, 33]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/UpdateImageWrite.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, ICommandParameters} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x34;
export const name: types.TCommandName = 'updateRun';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 33
        },
        bytes: [
            0x34, 0x01,
            0x21
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): ICommandParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);
    const requestId = buffer.getUint8();

    return {requestId};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ICommandParameters ): types.TBytes => command.toBytes(id, [parameters.requestId]);
