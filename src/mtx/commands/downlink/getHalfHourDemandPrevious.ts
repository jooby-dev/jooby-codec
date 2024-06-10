/**
 * Downlink command to get active `A+` energy for the previous day.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getHalfHourDemandPrevious from 'jooby-codec/mtx/commands/downlink/getHalfHourDemandPrevious.js';
 *
 * const bytes = getHalfHourDemandPrevious.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [75, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetHalfHourDemandPrevious.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


export const id: types.TCommandId = 0x4b;
export const name: types.TCommandName = 'getHalfHourDemandPrevious';
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
            0x4b, 0x00
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
