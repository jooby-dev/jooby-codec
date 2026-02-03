/**
 * Uplink command to get energy `A-` for 4 tariffs (`T1`-`T4`) for a given month.
 *
 * The corresponding downlink command: `getMonthDemandExport`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getMonthDemandExport from 'jooby-codec/mtx1/commands/uplink/getMonthDemandExport.js';
 *
 * // received energies
 * const bytes = [0x18, 0x03, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57];
 *
 * // decoded payload
 * const parameters = getMonthDemandExport.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     year: 24,
 *     month: 3,
 *     energies: [40301230, 3334244, 2333, 2145623]
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx1/commands/GetMonthDemandExport.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/BinaryBuffer.js';
import * as command from '../../utils/command.js';
import {READ_ONLY} from '../../constants/accessLevels.js';
import {
    TEnergies,
    getEnergies,
    setEnergies
} from '../../utils/CommandBinaryBuffer.js';
import {getMonthDemandExport as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';


interface IGetMonthDemandExportResponseParameters {
    year: types.TYear2000,
    month: types.TMonth,
    energies: TEnergies
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 18;
export const isLoraOnly = false;

export const examples: command.TCommandExamples = {
    'response energy for 2024.03': {
        id,
        name,
        headerSize,
        maxSize,
        accessLevel,
        parameters: {
            year: 24,
            month: 3,
            energies: [40301230, 3334244, 2333, 2145623]
        },
        bytes: [
            0x52, 0x12,
            0x18, 0x03, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x32, 0xe0, 0x64, 0x00, 0x00, 0x09, 0x1d, 0x00, 0x20, 0xbd, 0x57
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetMonthDemandExportResponseParameters => {
    validateCommandPayload(name, bytes, maxSize);

    const buffer: IBinaryBuffer = new BinaryBuffer(bytes, false);

    return {
        year: buffer.getUint8() as unknown as types.TYear2000,
        month: buffer.getUint8() as unknown as types.TMonth,
        energies: getEnergies(buffer)
    };
};


/**
 * Encode command parameters.
 *
 * @param parameters - command payload
 * @returns full message (header with body)
 */
export const toBytes = ( parameters: IGetMonthDemandExportResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    buffer.setUint8(parameters.year as unknown as types.TUint8);
    buffer.setUint8(parameters.month as unknown as types.TUint8);
    setEnergies(buffer, parameters.energies);

    return command.toBytes(id, buffer.data);
};
