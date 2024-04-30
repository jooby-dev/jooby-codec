/**
 * Downlink command to get device identifier.
 *
 * @example
 * ```js
 * import * as getDeviceId from 'jooby-codec/mtx/commands/downlink/getDeviceId.js';
 *
 * const bytes = getDeviceId.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [5, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetDeviceId.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import * as accessLevels from '../../constants/accessLevels.js';


const COMMAND_BODY_SIZE = 0;

export const id: types.TCommandId = 0x05;
export const name: types.TCommandName = 'getDeviceId';
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = accessLevels.READ_ONLY;
export const maxSize = COMMAND_BODY_SIZE;


export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        accessLevel,
        maxSize,
        parameters: {},
        bytes: [
            0x05, 0x00
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

    // no parameters to decode
    return {};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = (): types.TBytes => command.toBytes(id);
