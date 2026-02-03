/**
 * Downlink command to request status information from the sensor battery.
 *
 * By default, the battery status is measured once per 24 hours. The state of the battery physically cannot change dramatically.
 * Response to the request contains the latest measurement results. This is enough to monitor the battery condition.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getBatteryStatus from 'jooby-codec/analog/commands/downlink/getBatteryStatus.js';
 *
 * const bytes = getBatteryStatus.toBytes();
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [31, 5, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetBatteryStatus.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {getBatteryStatus as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';


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
            0x1f, 0x05, 0x00
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

    // no parameters to decode
    return {};
};


/**
 * Encode command parameters.
 *
 * @returns full message (header with body)
 */
export const toBytes = (): types.TBytes => command.toBytes(id);
