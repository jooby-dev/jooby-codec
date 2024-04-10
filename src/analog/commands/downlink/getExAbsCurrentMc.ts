/**
 * Command to request current consumption absolute values from device channels.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getExAbsCurrentMc from 'jooby-codec/analog/commands/downlink/getExAbsCurrentMc.js';
 *
 * const bytes = getExAbsCurrentMc.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [31, 15, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetExAbsCurrentMC.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';


export const id: types.TCommandId = 0x0f1f;
export const name: types.TCommandName = 'getExAbsCurrentMC';
export const headerSize = 3;

const COMMAND_BODY_SIZE = 0;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        parameters: {},
        bytes: [
            0x1f, 0x0f, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): command.ICommandParameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
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
