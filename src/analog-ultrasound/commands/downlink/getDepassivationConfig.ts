/**
 * Downlink command to request depassivation configuration from the device.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getDepassivationConfig from 'jooby-codec/analog-ultrasound/commands/downlink/getDepassivationConfig.js';
 *
 * const bytes = getDepassivationConfig.toBytes();
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [3, 34, 24]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog-ultrasound/commands/GetDepassivationConfig.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {getDepassivationConfig as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

const COMMAND_BODY_SIZE = 0;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        parameters: {},
        bytes: [
            0x03, 0x22, 0x18
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

    // No parameters to decode
    return {};
};


/**
 * Encode command parameters.
 *
 * @returns full message (header with body)
 */
export const toBytes = (): types.TBytes => command.toBytes(id);
