/**
 * Downlink command to get device type.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getDeviceType from 'jooby-codec/mtx/commands/downlink/getDeviceType.js';
 *
 * const bytes = getDeviceType.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [4, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetDeviceType.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


export const id: types.TCommandId = 0x04;
export const name: types.TCommandName = 'getDeviceType';
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 0;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {},
        bytes: [
            0x04, 0x00
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
