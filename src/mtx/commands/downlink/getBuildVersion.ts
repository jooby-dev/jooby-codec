/**
 * Downlink command to get firmware build date and version from device.
 *
 * The corresponding uplink command: {@link GetBuildVersionResponse}.
 *
 * @example
 * ```js
 * import * as getBuildVersion from 'jooby-codec/mtx/commands/downlink/GetBuildVersion.js';
 *
 * const bytes = getBuildVersion.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [121, 0]
 * ```
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetBuildVersion.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


export const id: types.TCommandId = 0x70;
export const name: types.TCommandName = 'getBuildVersion';
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 0;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        maxSize,
        accessLevel,
        parameters: {},
        bytes: [
            0x70, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): command.IEmptyCommandParameters => {
    if ( data.length !== maxSize ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
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
