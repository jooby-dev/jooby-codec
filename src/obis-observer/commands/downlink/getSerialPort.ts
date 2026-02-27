/**
 * Downlink command to get the information about serial port settings.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getSerialPort from 'jooby-codec/obis-observer/commands/downlink/getSerialPort.js';
 *
 * const parameters = {requestId: 7};
 * const bytes = getSerialPort.toBytes(parameters);
 *
 * // output command binary in hex representation
 * console.log(bytes);
 * // output
 * [7, 1, 7]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/obis-observer/commands/GetSerialPort.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../../types.js';
import {ICommandParameters} from '../../utils/binary/buffer.js';
import {getSerialPort as commandId} from '../../constants/downlinkIds.js';
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
            requestId: 7
        },
        bytes: [
            0x07, 0x01,
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
