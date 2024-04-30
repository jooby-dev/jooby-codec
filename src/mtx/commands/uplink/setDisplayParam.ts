/**
 * Downlink command to set the meter displays sorting order.
 *
 * The corresponding downlink command: `SetDisplayParam`.
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as setDisplayParam from 'jooby-codec/mtx/commands/uplink/setDisplayParam.js';
 *
 * // decoded payload
 * const command = setDisplayParam.fromBytes();
 *
 * console.log(command.parameters);
 * // output:
 * {}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetDisplayParam.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_WRITE} from '../../constants/accessLevels.js';

export const id: types.TCommandId = 0x5d;
export const name: types.TCommandName = 'setDisplayParam';
export const headerSize = 2;
export const maxSize = 0;
export const accessLevel: types.TAccessLevel = READ_WRITE;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        maxSize,
        accessLevel,
        parameters: {},
        bytes: [
            0x5d, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): command.IEmptyCommandParameters => {
    if ( data.length !== maxSize ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    return {};
};


/**
 * Encode command parameters.
 *
 * @returns full message (header with body)
 */
export const toBytes = (): types.TBytes => command.toBytes(id);
