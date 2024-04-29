/**
 * Uplink command to set full date and time on the meter.
 *
 * The corresponding downlink command: `SetDateTime`.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setDateTime from 'jooby-codec/mtx/commands/uplink/setDateTime.js';
 *
 * // empty response
 * const bytes = [];
 * const parameters = setDateTime.fromBytes(bytes);
 *
 * // this command doesn't have any parameters
 * console.log(parameters);
 * // output:
 * {}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetDateTime.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';

export const id: types.TCommandId = 0x08;
export const name: types.TCommandName = 'setDateTime';
export const headerSize = 2;
export const maxSize = 0;
export const accessLevel: types.TAccessLevel = READ_ONLY;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        maxSize,
        accessLevel,
        parameters: {},
        bytes: [
            0x08, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): command.IEmptyCommandParameters => {
    if ( data.length !== maxSize ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    return {};
};


/**
 * Encode command parameters.
 *
 * @returns full message (header with body)
 */
export const toBytes = (): types.TBytes => command.toBytes(id);
