/**
 * Downlink command to get events counters.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getEventsCounters from 'jooby-codec/mtx/commands/downlink/getEventsCounters.js';
 *
 * const bytes = getEventsCounters.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [52, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetEventsCounters.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import * as accessLevels from '../../constants/accessLevels.js';


export const id: types.TCommandId = 0x34;
export const name: types.TCommandName = 'getEventsCounters';
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = accessLevels.READ_ONLY;
export const maxSize = 0;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        accessLevel,
        maxSize,
        parameters: {},
        bytes: [
            0x34, 0x00
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
