/**
 * Downlink command to restart the device.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as reboot from 'jooby-codec/obis-observer/commands/downlink/reboot.js';
 *
 * const parameters = {requestId: 3};
 * const bytes = reboot.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [38, 1, 3]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/Reboot.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/CommandBinaryBuffer.js';
import {reboot as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
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
            0x26, 0x01,
            0x03
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): ICommandParameters => ({requestId: bytes[0]});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ICommandParameters ): types.TBytes => command.toBytes(id, [parameters.requestId]);
