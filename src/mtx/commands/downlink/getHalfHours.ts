/**
 * Downlink command to get active A+ energy in half hours by date.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getHalfHours from 'jooby-codec/mtx/commands/downlink/getHalfHours.js';
 *
 * const parameters = {
 *     year: 24,
 *     month: 3,
 *     date: 22,
 * };
 *
 * const bytes = activateRatePlan.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [21, 3, 24, 3, 22]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetHalfHours.md#request)
 */

import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


export const id: types.TCommandId = 0x15;
export const name: types.TCommandName = 'getHalfHours';
export const headerSize = 2;
export const maxSize = 3;
export const accessLevel: types.TAccessLevel = READ_ONLY;

export const examples: command.TCommandExamples = {
    'request half hour data for 2024.03.22 00:00:00 GMT': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            year: 24,
            month: 3,
            date: 22
        },
        bytes: [
            0x15, 0x03,
            0x18, 0x03, 0x16
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): types.IDate => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return buffer.getDate();
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: types.IDate ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    // body
    buffer.setDate(parameters);

    return command.toBytes(id, buffer.data);
};
