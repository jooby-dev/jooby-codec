/**
 * Response to write the block of the new image to the device. This command is part of update procedure.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as updateImageWrite from 'jooby-codec/obis-observer/commands/uplink/updateImageWrite.js';
 *
 * const bytes = [0x21];
 * const parameters = updateImageWrite.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 33
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/UpdateImageWrite.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x31;
export const name: types.TCommandName = 'updateImageWrite';
export const headerSize = 2;

const COMMAND_BODY_SIZE = REQUEST_ID_SIZE;

export const examples: command.TCommandExamples = {
    'success result': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 33
        },
        bytes: [
            0x31, 0x01,
            0x21
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ICommandParameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    return {requestId: bytes[0]};
};


/**
 * Encode command parameters.
 *
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ICommandParameters ): types.TBytes => command.toBytes(id, [parameters.requestId]);
