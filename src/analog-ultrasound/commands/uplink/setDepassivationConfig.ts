/**
 * Uplink command for setting depassivation configuration on the device.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as setDepassivationConfig from 'jooby-codec/analog-ultrasound/commands/uplink/setDepassivationConfig.js';
 *
 * // empty response
 * const bytes = [];
 *
 * // decoded payload
 * const parameters = setDepassivationConfig.fromBytes(bytes);
 *
 * // this command doesn't have any parameters
 * console.log(parameters);
 * // output:
 * {}
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog-ultrasound/commands/SetDepassivationConfig.md#response)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {setDepassivationConfig as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

const COMMAND_BODY_SIZE = 0;

export const examples: command.TCommandExamples = {
    'simple response': {
        id,
        name,
        headerSize,
        parameters: {},
        bytes: [
            0x03, 0x22, 0x19
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
    validateCommandPayload(name, bytes, COMMAND_BODY_SIZE);

    return {};
};


/**
 * Encode command parameters.
 *
 * @returns full message (header with body)
 */
export const toBytes = (): types.TBytes => command.toBytes(id);
