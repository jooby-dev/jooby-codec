/**
 * Downlink command to get the extended operator parameters.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getOperatorParametersExtended2 from 'jooby-codec/mtx3/commands/downlink/getOperatorParametersExtended2.js';
 *
 * const bytes = getOperatorParametersExtended2.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [71, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetOperatorParametersExtended2.md#request)
 */

import * as command from '../../../mtx/utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../../mtx/constants/accessLevels.js';


export const id: types.TCommandId = 0x47;
export const name: types.TCommandName = 'getOperatorParametersExtended2';
export const headerSize = 2;
export const maxSize = 0;
export const accessLevel: types.TAccessLevel = READ_ONLY;
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
            0x47, 0x00
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
