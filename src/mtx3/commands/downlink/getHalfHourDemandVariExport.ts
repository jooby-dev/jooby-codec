/**
 * Downlink command to get reactive energy `A-R+` (`II` quadrant) in half hours by date.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getHalfHourDemandVariExport from 'jooby-codec/mtx3/commands/downlink/getHalfHourDemandVariExport.js';
 *
 * const parameters = {
 *     date: {
 *         year: 24,
 *         month: 3,
 *         date: 22
 *     }
 * };
 *
 * const bytes = getHalfHourDemandVariExport.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [84, 3, 24, 3, 22]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetHalfHourDemandVariExport.md#request)
 */

import * as command from '../../../mtx/utils/command.js';
import {READ_ONLY} from '../../../mtx/constants/accessLevels.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import * as types from '../../types.js';


interface IGetHalfHourDemandVariParameters {
    date: types.IDate
}


export const id: types.TCommandId = 0x54;
export const name: types.TCommandName = 'getHalfHourDemandVariExport';
export const headerSize = 2;
export const maxSize = 3;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'request archive values for 2024.03.22': {
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
            0x54, 0x03,
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
export const fromBytes = ( bytes: types.TBytes ): IGetHalfHourDemandVariParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {date: buffer.getDate()};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetHalfHourDemandVariParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    // body
    buffer.setDate(parameters.date);

    return command.toBytes(id, buffer.data);
};
