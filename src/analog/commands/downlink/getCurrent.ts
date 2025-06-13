/**
 * Command to request the current pulse counter readings from the sensor.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getCurrent from 'jooby-codec/analog/commands/downlink/getCurrent.js';
 *
 * const bytes = getCurrent.toBytes();
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [7, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetCurrent.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {getCurrent as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;

const COMMAND_BODY_SIZE = 0;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        headerSize,
        name,
        parameters: {},
        bytes: [
            0x07, 0x00
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

    // no parameters to decode
    return {};
};


/**
 * Encode command parameters.
 *
 * @returns full message (header with body)
 */
export const toBytes = (): types.TBytes => command.toBytes(id);
