/**
 * Downlink command to get max power `A-` for 4 tariffs (`T1`-`T4`) for a given month for MTX1
 * and the maximum power for the month (`II` - `III` quadrant) for MTX3
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getMonthMaxDemandExport from 'jooby-codec/mtx/commands/downlink/getMonthMaxDemandExport.js';
 *
 * const parameters = {
 *     year: 24,
 *     month: 3
 * };
 *
 * const bytes = getMonthMaxDemandExport.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [89, 2, 24, 3]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx/commands/GetMonthMaxDemandExport.md#request)
 */

import * as types from '../../types.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';


interface IGetMonthDemandParameters {
    year: types.TYear2000,
    month: types.TMonth
}


export const id: types.TCommandId = 0x59;
export const name: types.TCommandName = 'getMonthMaxDemandExport';
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
            0x59, 0x02,
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
