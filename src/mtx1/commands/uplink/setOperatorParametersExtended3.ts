/**
 * Uplink command to set the shutdown thresholds for negative active power (`A-`).
 *
 * The corresponding downlink command: `setOperatorParametersExtended3`.
 *
 * Supported in MTX1 and MTX3 (since 26.05.21.0.0.5) devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as setOperatorParametersExtended3 from 'jooby-codec/mtx1/commands/uplink/setOperatorParametersExtended3.js';
 *
 * // empty response
 * const bytes = [];
 *
 * // decoded payload
 * const parameters = setOperatorParametersExtended3.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/SetOperatorParametersExtended3.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_WRITE} from '../../constants/accessLevels.js';


export const id: types.TCommandId = 0x72;
export const name: types.TCommandName = 'setOperatorParametersExtended3';
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
            0x72, 0x00
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
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = (): types.TBytes => command.toBytes(id);
