/**
 * Command to request signal quality.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getSignalQuality from 'jooby-codec/analog/commands/downlink/getSignalQuality.js';
 *
 * const bytes = getSignalQuality.toBytes();
 * // output: command binary in hex representation
 * console.log(bytes);
 * // output:
 * [31, 52, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetSignalQuality.md#request)
 */

import * as types from '../../../types.js';
import * as command from '../../utils/command.js';
import {getSignalQuality as commandId} from '../../constants/downlinkIds.js';
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
            0x1f, 0x34, 0x00
        ]
    }
};

/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
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
export const toBytes = (): types.TBytes => command.toBytes(id, []);
