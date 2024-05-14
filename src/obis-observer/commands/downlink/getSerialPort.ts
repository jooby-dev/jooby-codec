/**
 * Downlink command to get the information about serial port settings.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getSerialPort from 'jooby-codec/obis-observer/commands/downlink/getSerialPort.js';
 *
 * const parameters = {
 *     requestId: 7
 * };
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
import {ICommandParameters} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x07;
export const name: types.TCommandName = 'getSerialPort';
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
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( [requestId]: types.TBytes ): ICommandParameters => ({requestId});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( {requestId}: ICommandParameters ): types.TBytes => command.toBytes(id, [requestId]);
