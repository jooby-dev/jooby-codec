/**
 * Request to verify the update image on the device. This command is part of update procedure.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as updateImageVerify from 'jooby-codec/obis-observer/commands/downlink/updateImageVerify.js';
 *
 * const parameters = {
 *     requestId: 33
 * };
 * const bytes = updateImageVerify.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [50, 1, 33]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/UpdateImageVerify.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import CommandBinaryBuffer, {
    ICommandBinaryBuffer, ICommandParameters, REQUEST_ID_SIZE
} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x32;
export const name: types.TCommandName = 'updateImageVerify';
export const headerSize = 2;

const COMMAND_BODY_SIZE = REQUEST_ID_SIZE;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 33
        },
        bytes: [
            0x32, 0x01,
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
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

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
export const toBytes = ( parameters: ICommandParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(COMMAND_BODY_SIZE);
    const {requestId} = parameters;

    buffer.setUint8(requestId);

    return command.toBytes(id, buffer.data);
};
