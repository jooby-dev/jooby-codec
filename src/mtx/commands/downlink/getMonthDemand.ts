/**
 * Downlink command to get active energy (`A+`) for 4 tariffs (`T1`-`T4`) for a given month.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getMonthDemand from 'jooby-codec/mtx/commands/downlink/getMonthDemand.js';
 *
 * const parameters = {
 *     year: 24,
 *     month: 3
 * };
 *
 * const bytes = getMonthDemand.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [23, 2, 24, 3]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetMonthDemand.md#request)
 */

import * as types from '../../types.js';
import CommandBinaryBuffer, {ICommandBinaryBuffer} from '../../utils/CommandBinaryBuffer.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


interface IGetMonthDemandParameters {
    year: types.TYear2000,
    month: types.TMonth
}


export const id: types.TCommandId = 0x17;
export const name: types.TCommandName = 'getMonthDemand';
export const headerSize = 2;
export const maxSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'request energy for 2024.03': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            year: 24,
            month: 3
        },
        bytes: [
            0x17, 0x02,
            0x18, 0x03
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetMonthDemandParameters => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(bytes);

    return {
        year: buffer.getUint8() as unknown as types.TYear2000,
        month: buffer.getUint8() as unknown as types.TMonth
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetMonthDemandParameters ): types.TBytes => {
    const buffer: ICommandBinaryBuffer = new CommandBinaryBuffer(maxSize);

    // body
    buffer.setUint8(parameters.year as unknown as types.TUint8);
    buffer.setUint8(parameters.month as unknown as types.TUint8);

    return command.toBytes(id, buffer.data);
};
