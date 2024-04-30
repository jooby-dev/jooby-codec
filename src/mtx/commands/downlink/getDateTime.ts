/**
 * Downlink command to get full date from device.
 *
 * @example
 * ```js
 * import * as getDateTime from 'jooby-codec/mtx/commands/downlink/getDateTime.js';
 *
 * const bytes = getDateTime.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [7, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetBuildVersion.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


export const id: types.TCommandId = 0x07;
export const name: types.TCommandName = 'getDateTime';
export const headerSize = 2;
export const maxSize = 0;
export const accessLevel: types.TAccessLevel = READ_ONLY;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        maxSize,
        accessLevel,
        parameters: {},
        bytes: [
            0x07, 0x00
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
    if ( bytes.length !== maxSize ) {
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
