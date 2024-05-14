/**
 * Downlink command to get the information about observer, like name, software and hardware version.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getObserverInfo from 'jooby-codec/obis-observer/commands/downlink/getObserverInfo.js';
 *
 * const parameters = {
 *     requestId: 7
 * };
 *
 * const bytes = getObserverInfo.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * [1, 1, 7]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetObserverInfo.md#request)
 */

import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';


export const id: types.TCommandId = 0x01;
export const name: types.TCommandName = 'getObserverInfo';
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
            0x01, 0x01,
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
