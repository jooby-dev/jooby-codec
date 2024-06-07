/**
 * Downlink command to get max power `A+` for 4 tariffs (`T1`-`T4`) for a given month.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getMonthMaxDemand from 'jooby-codec/mtx/commands/downlink/getMonthMaxDemand.js';
 *
 * const parameters = {
 *     year: 24,
 *     month: 3
 * };
 *
 * const bytes = getMonthMaxDemand.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [50, 2, 24, 3]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetMonthMaxDemand.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


interface IGetMonthDemandParameters {
    year: types.TYear2000,
    month: types.TMonth
}


export const id: types.TCommandId = 0x32;
export const name: types.TCommandName = 'getMonthMaxDemand';
export const headerSize = 2;
export const maxSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'request max power for 2024.03': {
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
            0x32, 0x02,
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
    const [year, month] = bytes;

    return {year, month};
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( {year, month}: IGetMonthDemandParameters ): types.TBytes => (
    command.toBytes(id, [year, month])
);
