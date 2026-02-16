/**
 * Downlink command to set GSM parameters.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as setGsmParameters from 'jooby-codec/mtx1/commands/downlink/setGsmParameters.js';
 *
 * const parameters = {
 *     blockIndex: 1,
 *     data : [
 *         1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
 *         17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
 *         33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
 *         49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64
 *     ]
 * };
 *
 * const bytes = setGsmParameters.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [
 *     1,
 *     1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
 *     17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
 *     33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
 *     49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64
 * ];
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/SetGsmParameters.md#request)
 */

import * as types from '../../types.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {getStringFromBytes, IBytesConversionFormatOptions} from '../../../utils/bytesConversion.js';
import * as command from '../../utils/command.js';
import {
    GSM_BLOCK_SIZE,
    getGsmBlock,
    setGsmBlock,
    IGsmBlock
} from '../../utils/CommandBinaryBuffer.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {setGsmParameters as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
// block index + block prefix + length + block data + block crc
export const maxSize = 3 + GSM_BLOCK_SIZE + 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'block 0 request': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            index: 0,
            data: [60, 174, 22, 0, 0, 0, 0, 2, 83, 84, 65, 84, 73, 67, 73,
                80, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ]
        },
        bytes: [
            0x60, 0x41,
            0x00,
            0xda, 0x3c, 0xae, 0x16, 0x00, 0x00, 0x00, 0x00, 0x02, 0x53, 0x54, 0x41, 0x54, 0x49, 0x43, 0x49,
            0x50, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xce, 0xa3
        ]
    },
    'block 1 request': {
        id,
        name,
        headerSize,
        accessLevel,
        maxSize,
        parameters: {
            index: 1,
            data: [
                14, 0, 0, 204, 61, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                114, 117, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ]
        },
        bytes: [
            0x60, 0x41,
            0x01,
            0xda, 0x0e, 0x00, 0x00, 0xcc, 0x3d, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x72, 0x75, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x3b, 0x10
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGsmBlock => {
    validateCommandPayload(name, bytes, maxSize);

    return getGsmBlock(name, bytes);
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGsmBlock ): types.TBytes => (
    command.toBytes(id, setGsmBlock(parameters))
);

export const toJson = ( parameters: IGsmBlock, options: IBytesConversionFormatOptions ) => (
    JSON.stringify({
        ...parameters,
        data: getStringFromBytes(parameters.data, options)
    })
);
