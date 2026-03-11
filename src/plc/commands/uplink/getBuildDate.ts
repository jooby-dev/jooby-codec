/**
 * Uplink command to get build date of the plc device.
 *
 * The corresponding downlink command: `getBuildDate`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getBuildDate from 'jooby-codec/plc/commands/uplink/getBuildDate.js';
 *
 * const bytes = [
 *     0x14, 0x14,
 *     0x00, 0x00, 0x03, 0x1f, 0x00, 0x00, 0x03, 0x1f,
 *     0x00, 0x00, 0x03, 0x1f, 0x00, 0x00, 0x03, 0x1f,
 *     0x11, 0x11, 0x03, 0x00
 * ];
 *
 * // decoded payload
 * const parameters = buildDate.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     dateTime: 'Oct 20 2024 17:25:29'
 * }
 */

import * as types from '../../../mtx1/types.js';
import * as command from '../../../mtx1/utils/command.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {UNENCRYPTED} from '../../../mtx1/constants/accessLevels.js';
import {getBuildDate as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 20;
export const accessLevel: types.TAccessLevel = UNENCRYPTED;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'get build date response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            dateTime: 'Oct 20 2024 17:25:29'
        },
        bytes: [
            0x14, 0x14,
            0x4f, 0x63, 0x74, 0x20, 0x32, 0x30, 0x20, 0x32, 0x30, 0x32, 0x34, 0x20, 0x31, 0x37, 0x3a, 0x32, 0x35, 0x3a, 0x32, 0x39
        ]
    }
};

interface IGetBuildDateParameters {
    dateTime: string
}


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetBuildDateParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        dateTime: buffer.getFixedString(maxSize)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetBuildDateParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    buffer.setFixedString(parameters.dateTime, maxSize);

    return command.toBytes(id, buffer.data);
};
