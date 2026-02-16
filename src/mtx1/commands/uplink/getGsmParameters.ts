/**
 * Uplink command to get GSM parameters.
 *
 * The corresponding downlink command: `getGsmParameters`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getGsmParameters from 'jooby-codec/mtx1/commands/uplink/getGsmParameters.js';
 *
 * // response to getGsmParameters downlink command
 * const bytes = [
 *     1,
 *     1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
 *     17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
 *     33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
 *     49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64
 * ];
 *
 *
 * // decoded payload
 * const parameters = getGsmParameters.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     blockIndex: 1,
 *     data : [
 *         1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
 *         17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
 *         33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,
 *         49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64
 *     ]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetEventStatus.md#response)
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
import {getGsmParameters as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
// block index + block prefix + length + block data + block crc
export const maxSize = 3 + GSM_BLOCK_SIZE + 2;
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
            data: [
                60, 174, 22, 0, 0, 0, 0, 2, 83, 84, 65, 84, 73, 67, 73, 80, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0
            ]
        },
        bytes: [
            0x61, 0x41,
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
                60, 0, 0, 204, 61, 180, 65, 0, 5, 0, 0, 0, 0, 210, 4,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ]
        },
        bytes: [
            0x61, 0x41,
            0x01,
            0xda, 0x3c, 0x00, 0x00, 0xcc, 0x3d, 0xb4, 0x41, 0x00, 0x05, 0x00, 0x00, 0x00, 0x00, 0xd2, 0x04,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xa3, 0xc4
        ]
    },
    'block 3 request': {
        id,
        name,
        headerSize,
        accessLevel,
        maxSize,
        parameters: {
            index: 3,
            data: [
                60, 22, 5, 33, 10, 1, 7, 1, 0, 0, 0, 0, 0, 0, 0, 0, 77, 52, 159, 104, 16, 0,
                0, 128, 0, 130, 0, 64, 7, 224, 0, 1, 1, 1, 10, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ]
        },
        bytes: [
            0x61, 0x41,
            0x03,
            0xda, 0x3c, 0x16, 0x05, 0x21, 0x0a, 0x01, 0x07, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x4d, 0x34, 0x9f, 0x68, 0x10, 0x00, 0x00, 0x80, 0x00, 0x82, 0x00, 0x40, 0x07, 0xe0, 0x00,
            0x01, 0x01, 0x01, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x26, 0xc0
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
