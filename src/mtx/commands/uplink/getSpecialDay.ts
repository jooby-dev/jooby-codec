/**
 * Downlink command to get special day information for the given tariff table.
 *
 * The corresponding downlink command: `getSpecialDay`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getSpecialDay from 'jooby-codec/mtx/commands/uplink/getSpecialDay.js';
 *
 * // special day response
 * const bytes = [0x3d, 0x04, 0x01, 0x09, 0x03, 0x00];
 *
 * // decoded payload
 * const parameters = getSpecialDay.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     month: 1,
 *     date: 9,
 *     dayIndex: 3,
 *     isPeriodic: true
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetSpecialDay.md#response)
 */

import * as command from '../../utils/command.js';
import * as types from '../../types.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer, ISpecialDay} from '../../utils/CommandBinaryBuffer.js';


export const id: types.TCommandId = 0x3d;
export const name: types.TCommandName = 'getSpecialDay';
export const headerSize = 2;
export const maxSize = 4;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'special day response': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            month: 1,
            date: 9,
            dayIndex: 3,
            isPeriodic: true
        },
        bytes: [0x3d, 0x04, 0x01, 0x09, 0x03, 0x00]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - command body bytes
 * @returns decoded parameters
 */
export const fromBytes = ( bytes: types.TBytes ): ISpecialDay => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getSpecialDay();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command parameters
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: ISpecialDay ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setSpecialDay(parameters);

    return command.toBytes(id, buffer.data);
};
