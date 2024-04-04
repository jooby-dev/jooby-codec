/**
 * Command to get LMiC (IBM LoRaWAN in C) information.
 *
 * @example
 * ```js
 * import * as getLmicInfo from 'jooby-codec/analog/commands/downlink/getLmicInfo.js';
 *
 * const bytes = getLmicInfo.toBytes();
 * // command binary representation
 * console.log(bytes);
 * // [2, 31, 0]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/analog/commands/GetLmicInfo.md#request)
 */

import {TCommandId, TBytes} from '../../../types.js';
import * as command from '../../utils/command.js';


export const id: TCommandId = 0x021f;
export const headerSize = 3;
const COMMAND_BODY_SIZE = 0;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        headerSize,
        parameters: {},
        bytes: [
            0x1f, 0x02, 0x00
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: TBytes ) => {
    if ( data.length !== COMMAND_BODY_SIZE ) {
        throw new Error(`Wrong buffer size: ${data.length}.`);
    }

    return {};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = (): TBytes => command.toBytes(id);