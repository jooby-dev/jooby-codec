/**
 * Downlink command to get day energies `A-`, `R+`, `R-` for 4 tariffs (`T1`-`T4`) for date.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getDayDemandExport from 'jooby-codec/mtx3/commands/downlink/getDayDemandExport.js';
 *
 * const parameters = {
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     }
 * };
 *
 * const bytes = getDayDemandExport.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [79, 3, 24, 3, 22]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetDayDemandExport.md#request)
 */

import * as command from '../../../mtx1/utils/command.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import * as types from '../../types.js';


interface IGetDayDemandExportParameters {
    date: types.IDate
}


export const id: types.TCommandId = 0x4f;
export const name: types.TCommandName = 'getDayDemandExport';
export const headerSize = 2;
export const maxSize = 3;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'request day values for 2024.03.22 00:00:00 GMT': {
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
            0x4f, 0x03,
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
export const fromBytes = ( bytes: types.TBytes ): IGetDayDemandExportParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {date: buffer.getDate()};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetDayDemandExportParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    // body
    buffer.setDate(parameters.date);

    return command.toBytes(id, buffer.data);
};
