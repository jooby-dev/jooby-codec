/**
 * Command for software restart.
 *
 * A device restarts in ~30 seconds with new LoRaWAN parameters.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as softRestart from 'jooby-codec/analog/commands/downlink/softRestart.js';
 *
 * const bytes = softRestart.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [25, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/SoftRestart.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';


export const id: types.TCommandId = 0x19;
export const name: types.TCommandName = 'softRestart';
export const headerSize = 2;

const COMMAND_BODY_SIZE = 0;

export const examples: command.TCommandExamples = {
    'simple request': {
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
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): command.IEmptyCommandParameters => {
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
