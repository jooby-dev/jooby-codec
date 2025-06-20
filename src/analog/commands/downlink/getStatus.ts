/**
 * Downlink command to request status information from the sensor.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getStatus from 'jooby-codec/analog/commands/downlink/getStatus.js';
 *
 * const bytes = getStatus.toBytes();
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [20, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetStatus.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {getStatus as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


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
            0x14, 0x00
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
    if ( bytes.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${bytes.length}.`);
    }

    // No parameters to decode
    return {};
};


/**
 * Encode command parameters.
 *
 * @returns full message (header with body)
 */
export const toBytes = (): types.TBytes => command.toBytes(id);
