/**
 * Request to reset device settings.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as resetSettings from 'jooby-codec/obis-observer/commands/downlink/resetSettings.js';
 *
 * const parameters = {
 *     requestId: 3
 * };
 * const bytes = resetSettings.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [146, 1, 3]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/ResetSettings.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x92;
export const name: types.TCommandName = 'resetSettings';
export const headerSize = 2;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        parameters: {
            requestId: 3
        },
        bytes: [
            0x92, 0x01,
            0x03
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): ICommandParameters => ({requestId: bytes[0]});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ICommandParameters ): types.TBytes => command.toBytes(id, [parameters.requestId]);
