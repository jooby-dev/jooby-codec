/**
 * Response to setup the meter profile.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as setupMeterProfile from 'jooby-codec/obis-observer/commands/uplink/setupMeterProfile.js';
 *
 * const bytes =  [0x9c];
 * const parameters =  setupMeterProfile.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     requestId: 156
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/SetupMeterProfile.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import {ICommandParameters, REQUEST_ID_SIZE} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x61;
export const name: types.TCommandName = 'setupMeterProfile';
export const headerSize = 2;

const COMMAND_BODY_SIZE = REQUEST_ID_SIZE;

export const examples: command.TCommandExamples = {
    'successful result': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 156
        },
        bytes: [
            0x61, 0x01,
            0x9c
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
