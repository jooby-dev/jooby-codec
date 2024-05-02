/**
 * Downlink command to get full date from device.
 *
 * The corresponding downlink command: `getDateTime`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getDateTime from 'jooby-codec/mtx/commands/uplink/getDateTime.js';
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
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetDateTime.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {IDateTime} from '../../utils/dateTime.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x07;
export const name: types.TCommandName = 'getDateTime';
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
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): IDateTime => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getDateTime();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IDateTime ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    // body
    buffer.setDateTime(parameters);

    return command.toBytes(id, buffer.data);
};
