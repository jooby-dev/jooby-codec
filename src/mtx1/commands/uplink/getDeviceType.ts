/**
 * Uplink command to get device type.
 *
 * The corresponding downlink command: `getDeviceType`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getDeviceType from 'jooby-codec/mtx1/commands/uplink/getDeviceType.js'
 *
 * // type 1
 * const bytes = [0x00, 0x11, 0x21, 0x49, 0x21, 0xB6, 0x81, 0xC0, 0x00];
 *
 * // decoded payload
 * const parameters = getDeviceType.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     type: 'MTX 1A10.DG.2L5-LD4',
 *     revision: 0x0b,
 *     meterType: 0
 * };
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetDeviceType.md#response)
 */

import * as command from '../../utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import {
    IDeviceType,
    getDeviceType,
    setDeviceType
} from '../../utils/CommandBinaryBuffer.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getDeviceType as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 9;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'type 1': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            type: 'MTX 1A10.DG.2L5-LD4',
            revision: 0x0b,
            descriptor: {
                meterType: 'mtx1',
                typeMeterG: false,
                downgradedToA: false,
                supportMeterInfo: false
            }
        },
        bytes: [
            0x04, 0x09,
            0x00, 0x11, 0x21, 0x49, 0x21, 0xB6, 0x81, 0xC0, 0x00
        ]
    },
    'type 2': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            type: 'MTX 1G05.DH.2L2-DOB4',
            revision: 0x0b,
            descriptor: {
                meterType: 'mtx1',
                typeMeterG: true,
                downgradedToA: true,
                supportMeterInfo: false
            }
        },
        bytes: [
            0x04, 0x09,
            0x00, 0x12, 0x16, 0x47, 0x21, 0xb3, 0x17, 0x2c, 0x11
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IDeviceType => {
    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return getDeviceType(buffer);
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IDeviceType ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    setDeviceType(buffer, parameters);

    return command.toBytes(id, buffer.data);
};
