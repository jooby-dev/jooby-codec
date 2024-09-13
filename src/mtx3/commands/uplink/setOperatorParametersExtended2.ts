/**
 * Uplink command to set the extended operator parameters.
 *
 * The corresponding downlink command: `setOperatorParametersExtended2`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as setOperatorParametersExtended2 from 'jooby-codec/mtx3/commands/uplink/setOperatorParametersExtended2.js';
 *
 * // empty response
 * const bytes = [];
 *
 * // decoded payload
 * const parameters = setOperatorParametersExtended2.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/SetOperatorParametersExtended2.md#response)
 */

import * as command from '../../../mtx1/utils/command.js';
import * as types from '../../types.js';
import {READ_WRITE} from '../../../mtx1/constants/accessLevels.js';

export const id: types.TCommandId = 0x45;
export const name: types.TCommandName = 'setOperatorParametersExtended2';
export const headerSize = 2;
export const maxSize = 0;
export const accessLevel: types.TAccessLevel = READ_WRITE;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {},
        bytes: [
            0x45, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
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
