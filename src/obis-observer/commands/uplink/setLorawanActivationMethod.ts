/**
 * Response to set the Lorawan activation method OTAA or ABP.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as setLorawanActivationMethod from 'jooby-codec/obis-observer/commands/uplink/setLorawanActivationMethod.js';
 *
 * const bytes = [0x07];
 * const parameters = setLorawanActivationMethod.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 7
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetLorawanActivationMethod.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x25;
export const name: types.TCommandName = 'setLorawanActivationMethod';
export const headerSize = 2;

const COMMAND_BODY_SIZE = REQUEST_ID_SIZE;

export const examples: command.TCommandExamples = {
    'succeed result': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 7
        },
        bytes: [
            0x25, 0x01,
            0x07
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
