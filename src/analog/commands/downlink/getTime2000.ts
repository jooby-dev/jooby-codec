/**
 * Command to retrieve device time..
 *
 * @example
 * ```js
 * import * as getTime2000 from 'jooby-codec/analog/commands/downlink/GetTime2000.js';
 *
 * const bytes = getTime2000.toBytes();
 * // output: command binary in hex representation
 * console.log(bytes);
 * // output:
 * [9, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetTime2000.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';


export const id: types.TCommandId = 0x09;
export const headerSize = 2;

const COMMAND_BODY_SIZE = 0;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        headerSize,
        parameters: {},
        bytes: [
            0x09, 0x00
        ]
    }
};

/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ) => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    return {};
};

/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = (): types.TBytes => command.toBytes(id, []);
