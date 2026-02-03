/**
 * Command for software restart.
 *
 * A device restarts in ~30 seconds with new LoRaWAN parameters.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as softRestart from 'jooby-codec/analog/commands/downlink/softRestart.js';
 *
 * const bytes = softRestart.toBytes();
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [25, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/SoftRestart.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {softRestart as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = 0;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        parameters: {},
        bytes: [
            0x19, 0x00
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
