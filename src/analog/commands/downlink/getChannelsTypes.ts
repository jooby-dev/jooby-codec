/**
 * Command to get the types of channels on the device,
 * like IDLE, TEMPERATURE_SENSOR, or BINARY_SENSOR.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getChannelsTypes from 'jooby-codec/analog/commands/downlink/getChannelsTypes.js';
 *
 * const bytes = getChannelsTypes.toBytes();
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [31, 51, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetChannelsTypes.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {getChannelsTypes as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 3;

const COMMAND_BODY_SIZE = 0;

export const examples: command.TCommandExamples = {
    'request the channels map': {
        id,
        name,
        headerSize,
        parameters: {},
        bytes: [
            0x1f, 0x33, 0x00
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

    return {};
};


/**
 * Encode command parameters.
 *
 * @returns full message (header with body)
 */
export const toBytes = (): types.TBytes => command.toBytes(id);
