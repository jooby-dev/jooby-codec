/**
 * Command to run the update on the device.
 * This command is part of update procedure.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as updateRun from 'jooby-codec/analog/commands/uplink/updateRun.js';
 *
 * // empty response
 * const bytes = [];
 * const parameters = updateRun.fromBytes(bytes);
 *
 * // this command doesn't have any parameters
 * console.log(parameters);
 * // output:
 * undefined
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/UpdateRun.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';


export const id: types.TCommandId = 0x2c1f;
export const name: types.TCommandName = 'updateRun';
export const headerSize = 3;

const COMMAND_BODY_SIZE = 0;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        parameters: {},
        bytes: [
            0x1f, 0x2c, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): command.ICommandParameters => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
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
