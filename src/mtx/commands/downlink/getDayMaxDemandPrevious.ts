/**
 * Downlink command to get the maximum power of active energy (A+) for the previous day.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getDayMaxDemandPrevious from 'jooby-codec/mtx/commands/downlink/getDayMaxDemandPrevious.js';
 *
 * const bytes = getDayMaxDemandPrevious.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [74, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetDayMaxDemandPrevious.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


export const id: types.TCommandId = 0x4a;
export const name: types.TCommandName = 'getDayMaxDemandPrevious';
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 0;
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
            0x4a, 0x00
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
