/**
 * Downlink command to get the information about device uptime.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getObserverUptime from 'jooby-codec/obis-observer/commands/downlink/getObserverUptime.js';
 *
 * const parameters = {
 *     requestId: 7
 * };
 *
 * const bytes = getObserverUptime.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * [5, 1, 7]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObserverUptime.md#request)
 */

import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';


export const id: types.TCommandId = 0x05;
export const name: types.TCommandName = 'getObserverUptime';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 7
        },
        bytes: [
            0x05, 0x01,
            0x07
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( [requestId]: types.TBytes ): ICommandParameters => ({requestId});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( {requestId}: ICommandParameters ): types.TBytes => command.toBytes(id, [requestId]);
