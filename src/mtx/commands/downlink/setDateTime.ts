/**
 * Downlink command to set full date and time on the meter.
 *
 * @example
 * ```js
 * import * as setDateTime from 'jooby-codec/mtx/commands/downlink/setDateTime.js';
 *
 * const parameters = {
 *     isSummerTime: false,
 *     seconds: 55,
 *     minutes: 31,
 *     hours: 18,
 *     day: 2,
 *     date: 19,
 *     month: 2,
 *     year: 24
 * };
 * const bytes = getDateTime.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [8, 8, 0, 55, 31, 18, 2, 19, 2, 24]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/SetDateTime.md#request)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {IDateTime} from '../../utils/dateTime.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x08;
export const name: types.TCommandName = 'setDateTime';
export const headerSize = 2;
export const maxSize = 8;
export const accessLevel: types.TAccessLevel = READ_ONLY;

export const examples: command.TCommandExamples = {
    'time: 2024.02.19 18:31:55': {
        id,
        name,
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
            0x08, 0x08,
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
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IDateTime ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setDateTime(parameters);

    return command.toBytes(id, buffer.data);
};
