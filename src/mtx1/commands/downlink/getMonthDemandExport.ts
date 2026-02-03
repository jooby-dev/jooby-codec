/**
 * Downlink command to get energies `A-` for `MTX1` and `A-`, `R+`, `R-` (`II` - `III` quadrant) for `MTX3` for 4 tariffs (`T1`-`T4`) for a given month.
 *
 * Supported in MTX1 and MTX3 devices.
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import * as getMonthDemandExport from 'jooby-codec/mtx1/commands/downlink/getMonthDemandExport.js';
 *
 * const parameters = {
 *     year: 24,
 *     month: 3
 * };
 *
 * const bytes = getMonthDemandExport.toBytes(parameters);
 *
 * // command binary representation
 * console.log(bytes);
 * // output:
 * [82, 2, 24, 3]
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetMonthDemandExport.md#request)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {getMonthDemandExport as commandId} from '../../constants/downlinkIds.js';
import commandNames from '../../constants/downlinkNames.js';


interface IGetMonthDemandExportParameters {
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
            0x52, 0x02,
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
export const fromBytes = ( bytes: types.TBytes ): IGetMonthDemandExportParameters => {
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
export const toBytes = ( parameters: IGetMonthDemandExportParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    buffer.setUint8(parameters.year as unknown as types.TUint8);
    buffer.setUint8(parameters.month as unknown as types.TUint8);

    return command.toBytes(id, buffer.data);
};
