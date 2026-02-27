/**
 * Uplink command to get full date from device.
 *
 * The corresponding downlink command: `getDateTime`.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDateTime from 'jooby-codec/mtx1/commands/uplink/getDateTime.js';
 *
 * // device time is: 2024.02.19 18:31:55
 * const bytes = [0x00, 0x37, 0x1f, 0x12, 0x02, 0x13, 0x02, 0x18];
 *
 * // decoded payload
 * const parameters = getDateTime.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     isSummerTime: false,
 *     seconds: 55,
 *     minutes: 31,
 *     hours: 18,
 *     day: 2,
 *     date: 19,
 *     month: 2,
 *     year: 24
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetDateTime.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import {IDateTime} from '../../utils/dateTime.js';
import * as command from '../../utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {
    getDateTime,
    setDateTime
} from '../../utils/binary/buffer.js';
import {getDateTime as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const maxSize = 8;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'time: 2024.02.19 18:31:55': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            isSummerTime: false,
            seconds: 55,
            minutes: 31,
            hours: 18,
            day: 2,
            date: 19,
            month: 2,
            year: 24
        },
        bytes: [
            0x07, 0x08,
            0x00, 0x37, 0x1f, 0x12, 0x02, 0x13, 0x02, 0x18
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IDateTime => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return getDateTime(buffer);
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IDateTime ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    setDateTime(buffer, parameters);

    return command.toBytes(id, buffer.data);
};
