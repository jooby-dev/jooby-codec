/**
 * Uplink command to provide the date and parameters of tariff plan activation.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as activateRatePlan from 'jooby-codec/mtx/commands/uplink/activateRatePlan.js';
 *
 * // empty response
 * const bytes = [];
 * const parameters = activateRatePlan.fromBytes(bytes);
 *
 * // this command doesn't have any parameters
 * console.log(parameters);
 * // output:
 * {}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/ActivateRatePlan.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';


export const id: types.TCommandId = 0x13;
export const name: types.TCommandName = 'activateRatePlanResponse';
export const headerSize = 2;

const COMMAND_BODY_SIZE = 0;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        parameters: {},
        bytes: [
            0x13, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): command.IEmptyCommandParameters => {
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
