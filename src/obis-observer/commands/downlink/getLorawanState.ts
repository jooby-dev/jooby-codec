/**
 * Downlink command.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getLorawanState from 'jooby-codec/obis-observer/commands/downlink/getLorawanState.js';
 *
 * const parameters = {
 *     requestId: 8
 * };
 *
 * const bytes = getLorawanState.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // [34, 1, 8]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetLorawanState.md#request)
 */

import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';


export const id: types.TCommandId = 0x22;
export const name: types.TCommandName = 'getLorawanState';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 8
        },
        bytes: [
            0x22, 0x01,
            0x08
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
