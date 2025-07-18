/**
 * Command for software restart.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as softRestart from 'jooby-codec/analog/commands/uplink/softRestart.js';
 *
 * // empty response
 * const bytes = [];
 *
 * // decoded payload
 * const parameters = softRestart.fromBytes(bytes);
 *
 * // this command doesn't have any parameters
 * console.log(parameters);
 * // output:
 * undefined
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/SoftRestart.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {softRestart as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = 0;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        parameters: {},
        bytes: [
            0x19, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): command.IEmptyCommandParameters => {
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    return {};
};


/**
 * Encode command parameters.
 *
 * @returns full message (header with body)
 */
export const toBytes = (): types.TBytes => command.toBytes(id);
