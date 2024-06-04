/**
 * Downlink command to get the maximum `A+` power for the day.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getDayMaxDemand from 'jooby-codec/mtx/commands/downlink/getDayMaxDemand.js';
 *
 * const parameters = {
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     }
 * };
 *
 * const bytes = getDayMaxDemand.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [49, 3, 24, 3, 22]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetDayMaxDemand.md#request)
 */

import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


interface IGetDayMaxDemandParameters {
    date: types.IDate
}


export const id: types.TCommandId = 0x31;
export const name: types.TCommandName = 'getDayMaxDemand';
export const headerSize = 2;
export const maxSize = 3;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'request for 2024.03.22': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            date: {
                year: 24,
                month: 3,
                date: 22
            }
        },
        bytes: [
            0x31, 0x03,
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
export const fromBytes = ( bytes: types.TBytes ): IGetDayMaxDemandParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {date: buffer.getDate()};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDayMaxDemandParameters ) : types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    buffer.setDate(parameters.date);

    return command.toBytes(id, buffer.data);
};
