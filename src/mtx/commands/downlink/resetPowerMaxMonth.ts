/**
 * Downlink command to reset the maximum monthly power.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as resetPowerMaxMonth from 'jooby-codec/mtx/commands/downlink/resetPowerMaxMonth.js';
 *
 * const bytes = resetPowerMaxMonth.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [54, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/ResetPowerMaxMonth.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_WRITE} from '../../constants/accessLevels.js';


export const id: types.TCommandId = 0x36;
export const name: types.TCommandName = 'resetPowerMaxMonth';
export const headerSize = 2;
export const maxSize = 0;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {},
        bytes: [
            0x36, 0x00
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
