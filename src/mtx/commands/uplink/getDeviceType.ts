/**
 * Uplink command to get device type.
 *
* @packageDocumentation
 *
 * @example
 * ```js
 * import * as getDeviceType from 'jooby-codec/mtx/commands/uplink/getDeviceType.js'
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
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetDeviceType.md#response)
 */

import * as command from '../../utils/command.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, IDeviceType} from '../../utils/CommandBinaryBuffer.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import * as meterTypes from '../../constants/meterTypes.js';


export const id: types.TCommandId = 0x04;
export const name: types.TCommandName = 'getDeviceType';
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
            meterType: meterTypes.A
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
            meterType: meterTypes.G_FULL
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
 * @param data - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( data: types.TBytes ): IDeviceType => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(data);

    return buffer.getDeviceType();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IDeviceType ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    // body
    buffer.setDeviceType(parameters);

    return command.toBytes(id, buffer.data);
};
