/**
 * Downlink command with arbitrary data to the device to verify communication.
 *
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getLoopback from 'jooby-codec/plc/commands/downlink/getLoopback.js';
 *
 * const parameters = {
 *     data: [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]
 * };
 *
 * const bytes = getLoopback.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [8, 16, 0, 1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
 * ```
 */

import * as types from '../../types.js';
import * as command from '../../../mtx1/utils/command.js';
import {UNENCRYPTED} from '../../../mtx1/constants/accessLevels.js';
import {getLoopback as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetLoopbackParameters {
    data: types.TBytes
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 100;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'simple request': {
        id,
        name,
        headerSize,
        accessLevel,
        parameters: {
            data: [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f]
        },
        bytes: [
            0x08, 0x10,
            0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetLoopbackParameters => ({data: bytes});


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetLoopbackParameters ): types.TBytes => (
    command.toBytes(id, parameters.data)
);
