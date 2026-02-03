/**
 * Downlink command to get energies (`A+` for `MTX1` and `A+`, `R+`, `R-` for `MTX3`) for 4 tariffs (`T1`-`T4`) for a given month.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getMonthDemand from 'jooby-codec/mtx1/commands/downlink/getMonthDemand.js';
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
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetMonthDemand.md#request)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getMonthDemand as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetMonthDemandParameters {
    year: types.TYear2000,
    month: types.TMonth
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
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
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

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
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    buffer.setUint8(parameters.year as unknown as types.TUint8);
    buffer.setUint8(parameters.month as unknown as types.TUint8);

    return command.toBytes(id, buffer.data);
};
