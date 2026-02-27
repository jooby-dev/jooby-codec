/**
 * Uplink command to get energies (`A+`, `R+`, `R-`) for 4 tariffs (`T1`-`T4`) for a given month.
 *
 * The corresponding downlink command: `getMonthDemand`.
 *
 * @packageDocumentation
 *
 * @example create command instance from command body hex dump
 * ```js
 * import * as getMonthDemand from 'jooby-codec/mtx3/commands/uplink/getMonthDemand.js';
 *
 * // received energies
 * const bytes = [
 *     0x18, 0x03, 0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, 0x00, 0x32,
 *     0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1, 0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c,
 *     0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40, 0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c,
 *     0x0a, 0x14
 * ];
 *
 * // decoded payload
 * const parameters = getMonthDemand.fromBytes(bytes);
 *
 * console.log(parameters);
 * // output:
 * {
 *     year: 24,
 *     month: 3,
 *     energies: {
 *         wh: [40301230, 3334244, 15000, 2145623],
 *         vari: [25000, 1234567, 789456, 9876543],
 *         vare: [987654, 654321, 123456, 789012]
 *     }
 * }
 * ```
 *
 * [Command format documentation](https://github.com/jooby-dev/jooby-docs/blob/main/docs/mtx3/commands/GetMonthDemand.md#response)
 */

import * as types from '../../types.js';
import BinaryBuffer, {IBinaryBuffer} from '../../../utils/binary/BinaryBuffer.js';
import * as command from '../../../mtx1/utils/command.js';
import mapEnergiesToObisCodes from '../../utils/mapEnergiesToObisCodes.js';
import {
    IEnergies,
    getEnergies,
    setEnergies
} from '../../utils/binary/buffer.js';
import validateCommandPayload from '../../../utils/validateCommandPayload.js';
import {READ_ONLY} from '../../../mtx1/constants/accessLevels.js';
import * as dlms from '../../constants/dlms.js';
import {A_PLUS_R_PLUS_R_MINUS} from '../../constants/energyTypes.js';
import {getMonthDemand as commandId} from '../../constants/uplinkIds.js';
import commandNames from '../../constants/uplinkNames.js';


interface IGetMonthDemandResponseParameters {
    year: types.TYear2000,
    month: types.TMonth,
    energies: IEnergies
}


export const id: types.TCommandId = commandId;
export const name: types.TCommandName = commandNames[commandId];
export const headerSize = 2;
export const accessLevel: types.TAccessLevel = READ_ONLY;
export const maxSize = 50;
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
            energies: {
                wh: [40301230, 3334244, 15000, 2145623],
                vari: [25000, 1234567, 789456, 9876543],
                vare: [987654, 654321, 123456, 789012]
            }
        },
        bytes: [
            0x17, 0x32,
            0x18, 0x03, // date
            0x02, 0x66, 0xf2, 0xae, 0x00, 0x00, 0x61, 0xa8, 0x00, 0x0f, 0x12, 0x06, // tariff 1
            0x00, 0x32, 0xe0, 0x64, 0x00, 0x12, 0xd6, 0x87, 0x00, 0x09, 0xfb, 0xf1, // tariff 2
            0x00, 0x00, 0x3a, 0x98, 0x00, 0x0c, 0x0b, 0xd0, 0x00, 0x01, 0xe2, 0x40, // tariff 3
            0x00, 0x20, 0xbd, 0x57, 0x00, 0x96, 0xb4, 0x3f, 0x00, 0x0c, 0x0a, 0x14 // tariff 4
        ]
    }
};


/**
 * Decode command parameters.
 *
 * @param bytes - only body (without header)
 * @returns command payload
 */
export const fromBytes = ( bytes: types.TBytes ): IGetMonthDemandResponseParameters => {
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
export const toBytes = ( parameters: IGetMonthDemandResponseParameters ): types.TBytes => {
    const buffer: IBinaryBuffer = new BinaryBuffer(maxSize, false);

    // body
    buffer.setUint8(parameters.year as unknown as types.TUint8);
    buffer.setUint8(parameters.month as unknown as types.TUint8);
    setEnergies(buffer, parameters.energies);

    return command.toBytes(id, buffer.data);
};


export const toJson = ( parameters: IGetMonthDemandResponseParameters, options: dlms.IJsonOptions = dlms.defaultJsonOptions ) => {
    if ( !options.dlms ) {
        return JSON.stringify(parameters);
    }

    const {year, month, energies} = parameters;

    return JSON.stringify({
        year,
        month,
        ...mapEnergiesToObisCodes(energies, options.isGreen, A_PLUS_R_PLUS_R_MINUS)
    });
};
